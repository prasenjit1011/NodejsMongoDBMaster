// server.js
const app = require('./app');
const { connectToDatabase } = require('./mongo');

const PORT = process.env.PORT || 8040;

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
