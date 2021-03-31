import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cognito from '@aws-cdk/aws-cognito';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "BookmarkWebsiteBucket", {
      publicReadAccess: true,
      websiteIndexDocument: "index.html"
    })

    new s3Deployment.BucketDeployment(this, "BucketDeployment", {
      sources: [s3Deployment.Source.asset("../frontend/public")],
      destinationBucket: bucket
    })

    new cloudfront.CloudFrontWebDistribution(this, "BookmarkWebsite", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{
            isDefaultBehavior: true
          }]
        }
      ]
    })

    const userPool = new cognito.UserPool(this, "UserPoolForBookmark", {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: {email: true},
      userVerification: {
        emailSubject: "Verification Code for Bookmark App",
        emailBody: "Welcome {username} to your Bookmark App, The code is {####}",
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      passwordPolicy: {
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: false,
        requireUppercase: false
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required:true,
          mutable: true
        }
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, "BookmarkUserPoolClient", {
      userPool
    })

    const api = new appsync.GraphqlApi(this, "BookmarkAppGraphqlApi", {
      name: "BookmarkAppGraphqlApi",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(7))
          }
        }
      }
    })

    const httpDataSource = api.addHttpDataSource("HttpsDataSource", `https://events.${this.region}.amazonaws.com/`, {
      name: "HttpDataSourceWithEventBridge",
      description: "Appsync to eventbridge",
      authorizationConfig: {
        signingRegion: this.region,
        signingServiceName: "events"
      }
    })
    events.EventBus.grantAllPutEvents(httpDataSource)

    const bookmarkLambda = new lambda.Function(this, "BookmarkLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "main.handler",
      timeout: cdk.Duration.seconds(10)
    })

    const table = new dynamodb.Table(this, "BookmarkTable", {
      tableName: "BookmarkTable",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      }
    })
    table.grantFullAccess(bookmarkLambda);
    table.addGlobalSecondaryIndex({
      indexName: "user",
      partitionKey: {
        name: "user",
        type: dynamodb.AttributeType.STRING
      }
    })

    const dynamoDataSource = api.addDynamoDbDataSource("DynamoDataSource", table);

    dynamoDataSource.createResolver({
      typeName: "Query",
      fieldName: "getBookmarks",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("vtl/getBookmark/request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("vtl/getBookmark/response.vtl")
    })

    httpDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createBookmark",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("vtl/addBookmark/request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("vtl/addBookmark/response.vtl")
    })

    httpDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateBookmark",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("vtl/updateBookmark/request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("vtl/updateBookmark/response.vtl")
    })

    httpDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteBookmark",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("vtl/deleteBookmark/request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("vtl/deleteBookmark/response.vtl")
    })

    const bookmarkRule = new events.Rule(this, "BookmarkGraphqlRule", {
      eventPattern: {
        source: ["appsync-add-event", "appsync-update-event", "appsync-delete-event"]
      },
      targets: [new targets.LambdaFunction(bookmarkLambda)]
    })
  }
}
