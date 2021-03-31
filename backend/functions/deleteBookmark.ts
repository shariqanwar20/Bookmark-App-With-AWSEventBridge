import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

export const deleteBookmark = async (bookamrkId: string) => {
    try {
        console.log("DELETE BOOKMARK: ", bookamrkId);
        const params = {
            TableName: "BookmarkTable",
            Key: {
                id: bookamrkId
            }
        }
    
        await docClient.delete(params).promise();
    } catch (error) {
        console.log("Error: ", error);
    }
};
