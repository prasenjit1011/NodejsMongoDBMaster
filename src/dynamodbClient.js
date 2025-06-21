const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1' // or your preferred region
});

module.exports = dynamodb;
