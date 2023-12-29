
let response;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const nanoid  = require('nanoid');
const { v4: uuidv4 } = require('uuid');
const docClient = new dynamodb.DocumentClient()

exports.FetchAllUsers = async (event, context) => {
    const data = await docClient.scan({
        TableName: 'usersDB'
    }).promise()
    response = {
            'statusCode': 200,
            'body': JSON.stringify({
                users: data.Items,
            })
        }
    return response
};

exports.CreateUser = async (event, context) => {
    console.log(event,'req body');
    const {username, email, password} = JSON.parse(event.body)
    await docClient.put({
        TableName: 'usersDB',
        Item:{
            id: uuidv4(),
            username,
            email,
            password
        }
    }).promise()
    response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'User is Created',
            })
        }
    return response
};

exports.DeleteUser = async (event, context) => {
    await docClient.delete({
         TableName: 'usersDB',
         key:{
             id: event.pathParameters.id,
         }
     }).promise()
     response = {
             'statusCode': 200,
             'body': JSON.stringify({
                 message: 'User is Deleted',
             })
         }
     return response
 };

 exports.UpdateUser = async (event, context) => {
    const Item = JSON.parse(event.body)
    await docClient.update({
         TableName: 'usersDB',
         key:{
             id: event.pathParameters.id,
         },
         UpdateExpression: 'set username = :u, email = :e, password = :p',
         ExpressionAttributeValues:{
            ':u': Item.username,
            ':e': Item.email,
            ':p': Item.password
         },
         ReturnValues: 'UPDATED_NEW',
     }).promise()
     response = {
             'statusCode': 200,
             'body': JSON.stringify({
                 message: 'User is Deleted',
             })
         }
     return response
 };

