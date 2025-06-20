console.clear();
console.log('\n\n-: App Started :-');

const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');

const app = express();
let client;

// 🔹 Initialize OpenID Client
async function initializeClient() {
  try {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_7Z77Gffng');
    client = new issuer.Client({
      client_id: '22h45k0pj9qmht7ocd7gvuj4ks',
      client_secret: '<client secret>',
      redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net/callback'],
      response_types: ['code']
    });
    console.log('-: OpenID Client Initialized :-');
  } catch (err) {
    console.error('❌ Failed to initialize OpenID client:', err);
  }
}
initializeClient();

// 🔹 Express App Setup
app.set('view engine', 'ejs');
app.use(session({
  secret: 'test123test123',
  resave: false,
  saveUninitialized: false
}));

// 🔹 Auth Middleware
app.use((req, res, next) => {
  req.isAuthenticated = !!req.session.userInfo;
  next();
});

// 🔹 Home Route
app.get('/', (req, res) => {
  res.render('home', {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo
  });
});

// 🔹 Login Route
app.get('/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: 'openid email phone',
    state,
    nonce
  });

  res.redirect(authUrl);
});

// 🔹 Callback Route
app.get('/callback', async (req, res) => {
  try {
    const callbackUrl = `${req.protocol}://${req.get('host')}/callback`;
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(callbackUrl, params, {
      nonce: req.session.nonce,
      state: req.session.state
    });

    req.session.userInfo = await client.userinfo(tokenSet.access_token);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Callback error:', err);
    res.status(400).send('Invalid request: Please check your input and try again.');
  }
});

// 🔹 Dashboard Route
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated) return res.redirect('/login');

  res.render('dashboard', {
    userInfo: req.session.userInfo
  });
});

// 🔹 Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    const clientId = '22h45k0pj9qmht7ocd7gvuj4ks';
    const userPoolDomain = '1vwl-h.auth.us-east-1.amazoncognito.com';
    const postLogoutRedirectUri = `${req.protocol}://${req.get('host')}`;

    const logoutUrl = `https://${userPoolDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
    res.redirect(logoutUrl);
  });
});

// 🔹 Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Central Error Handler:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 🔹 Start Server
app.listen(3000, () => {
  const now = new Date();
  console.log(`🕒 Started at: ${now.getMinutes()}:${now.getSeconds()}`);
  console.log('-: App Running on http://localhost:3000 :-');
});
