const WebSocket = require('ws');
const EventEmitter = require('events');

// Create an event emitter instance
const wsEmitter = new EventEmitter();

const socket = new WebSocket('wss://ws.finnhub.io?token=d0i3nohr01ql18mrkb8gd0i3nohr01ql18mrkb90');

// Connection opened
socket.addEventListener('open', function () {
  console.log('✅ WebSocket is open. Waiting 5 seconds...');

  setTimeout(() => {
    console.log('⏱️ Sending subscription message after delay');
    const message = { type: 'subscribe', symbol: 'BINANCE:BTCUSDT' };
    socket.send(JSON.stringify(message));

    // Emit custom event
    wsEmitter.emit('subscribed', message);
  }, 5000);
});

// Message received
socket.addEventListener('message', function (event) {
  const parsedData = JSON.parse(event.data);
  
  console.log('📨 Message from server:', parsedData);
  console.log('\n\n');

  // Emit a custom event with parsed data
  wsEmitter.emit('priceUpdate', parsedData);
});

// Unsubscribe function
const unsubscribe = function(symbol) {
  const message = { type: 'unsubscribe', symbol };
  socket.send(JSON.stringify(message));
  wsEmitter.emit('unsubscribed', message);
};

module.exports = {
  wsEmitter,
  unsubscribe
};
