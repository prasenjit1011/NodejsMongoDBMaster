console.clear();
console.log('\n\n-: App Started :-');

const express   = require('express');
const app       = express();

app.use('/', (req, res, next)=>{
    try{
        console.log('-: Welcome :-');
        res.send('-: Welcome :-'+x);
        next()
    }
    catch(e){
        throw new Error('Synchronous Error!');
    }
});

// Simulated async error
app.get('/async', async (req, res, next) => {
  Promise.reject(new Error('Unhandled Promise Rejection!'));
});


// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('Central Error Handler:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

console.log('-: App Running :-');
const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// ----------------------------
// 🔒 Process-Level Error Handling
// ----------------------------

// Catch synchronous exceptions not caught in routes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdownGracefully();
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  shutdownGracefully();
});

// Graceful shutdown
function shutdownGracefully() {
  console.log('Shutting down server...');
  server.close(() => {
    process.exit(1);
  });
}
