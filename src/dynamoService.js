const dynamodb = require('./dynamodbClient');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Products';

exports.createProduct = async (data) => {
  const product = {
    id: uuidv4(),
    name: data.name,
    price: data.price,
    createdAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: TABLE_NAME,
    Item: product
  }).promise();

  return product;
};

exports.getProduct = async (id) => {
  const result = await dynamodb.get({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();

  return result.Item;
};

exports.updateProduct = async (id, data) => {
  const result = await dynamodb.update({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #name = :name, price = :price",
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: {
      ":name": data.name,
      ":price": data.price
    },
    ReturnValues: "ALL_NEW"
  }).promise();

  return result.Attributes;
};

exports.deleteProduct = async (id) => {
  await dynamodb.delete({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();

  return { deleted: true };
};
