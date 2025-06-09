module.exports.hello = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello from Serverless Lambda! 09jun 2025--01' }),
    };
  };
  