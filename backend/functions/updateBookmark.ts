import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
    TableName: string;
    Key: {
      id: string;
    };
    ExpressionAttributeValues: any;
    ExpressionAttributeNames: any;
    UpdateExpression: string;
    ReturnValues: string;
};
  

export const updateBookmark = async (bookamrk: any) => {
    try {
        console.log("UPDATE BOOKMARK: ", bookamrk);
        const params: Params = {
            TableName: "BookmarkTable",
            Key: {
                id: bookamrk.id
            },
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
            UpdateExpression: "",
            ReturnValues: "UPDATED_NEW"
        }

        let prefix = "set"
        const attributes = Object.keys(bookamrk)
        for (let i = 0; i < attributes.length; i++)
        {
            let attribute = attributes[i];
            if (attribute !== "id")
            {
                params["UpdateExpression"] += `${prefix} #${attribute} = :${attribute}`;
                params["ExpressionAttributeNames"][`#${attribute}`] = attribute;
                params["ExpressionAttributeValues"][`:${attribute}`] = bookamrk[attribute]
                prefix = ","
            }
        }
    
        await docClient.update(params).promise();
    } catch (error) {
        console.log("Error: ", error);
        
    }
};
