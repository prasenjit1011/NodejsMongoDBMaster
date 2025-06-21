const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
});

module.exports = dynamodb;
