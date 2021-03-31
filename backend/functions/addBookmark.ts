import * as AWS from "aws-sdk";
import * as crypto from 'crypto';

const docClient = new AWS.DynamoDB.DocumentClient();

export const addBookmark = async (bookamrk: Bookmark) => {
    try {
        const id = {
            id: crypto.randomBytes(32).toString("hex")
        }
        const newBookmark = {...bookamrk, ...id}
        console.log("ADD BOOKMARK: ", newBookmark);
        const params = {
            TableName: "BookmarkTable",
            Item: newBookmark
        }
    
        await docClient.put(params).promise();
    } catch (error) {
        console.log("Error: ", error);
        
    }
};
