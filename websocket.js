const WebSocket = require('ws');

let coinbaseWS = null;
let reconnectTimeout = null;
let isCooldown = false;

function connectToCoinbase() {
  if (isCooldown) {
    console.log('Cooldown active. Waiting before reconnecting...');
    return;
  }

  console.log('Connecting to Coinbase WebSocket...');
  coinbaseWS = new WebSocket('wss://ws-feed.exchange.coinbase.com');

  coinbaseWS.on('open', () => {
    console.log('Connected to Coinbase');
    coinbaseWS.send(JSON.stringify({
      type: 'subscribe',
      channels: [{ name: 'ticker', product_ids: ['BTC-USD'] }]
    }));
  });

  coinbaseWS.on('message', (data) => {
    const parsed = JSON.parse(data);
    if (parsed.type === 'ticker') {
      console.log(`BTC Price: $${parsed.price} at ${parsed.time}`);
    }
  });

  coinbaseWS.on('close', () => {
    console.warn('WebSocket closed');
    scheduleReconnect();
  });

  coinbaseWS.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    coinbaseWS.close(); // Trigger close for reconnect logic
  });
}

function scheduleReconnect() {
  if (isCooldown) return;

  isCooldown = true;
  console.log('Waiting 5 seconds before reconnecting...');
  
  reconnectTimeout = setTimeout(() => {
    isCooldown = false;
    connectToCoinbase();
  }, 5000); // 5 seconds
}

connectToCoinbase();
