const WebSocket = require('ws');

// Local WebSocket server (for your clients)
const server = new WebSocket.Server({ port: 3000 });
console.log('WebSocket server running on ws://localhost:3000');

// Connect to Coinbase WebSocket feed
const coinbaseWS = new WebSocket('wss://ws-feed.exchange.coinbase.com');

// Subscribe to BTC-USD ticker on Coinbase
coinbaseWS.on('open', () => {
  console.log('--connected--');

  coinbaseWS.send(JSON.stringify({
    type: 'subscribe',
    channels: [{ name: 'ticker', product_ids: ['BTC-USD'] }]
  }));
});

// When message received from Coinbase
coinbaseWS.on('message', (data) => {
  const parsed = JSON.parse(data);

  const dtd = new Date;
  console.log(`\n--connected msg -- ${dtd.getHours()}: ${dtd.getMinutes()} : ${dtd.getSeconds()} : ${dtd.getMilliseconds()}`);
  

  // Broadcast to all connected clients
  if (parsed.type === 'ticker') {
    const message = JSON.stringify({
      price: parsed.price,
      time: parsed.time
    });

    console.log(message);

    server.clients.forEach(client => {
      console.log('--- Clients ---');

      if (client.readyState === WebSocket.OPEN) {
        console.log('--- Client Ready ---');
        client.send(message);
      }
    });
  }
});

// Log client connections
server.on('connection', (client) => {
  console.log('Client connected to local WebSocket');

  client.send(JSON.stringify({ message: 'Welcome to BTC Price Feed!' }));
});
