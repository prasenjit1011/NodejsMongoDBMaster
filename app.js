console.clear();
console.log('\n\n-: App Started :-');

const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');

const app = express();
app.set('view engine', 'ejs');
 
let client;

// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXNB8qhQ2');
    client = new issuer.Client({
        client_id: '3ofju9bq077uisvcv18aj8lrsn',
        client_secret: '<client secret>',
        redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false
}));

const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
      req.isAuthenticated = false;
  } else {
      req.isAuthenticated = true;
  }
  next();
};


app.get('/', checkAuth, (req, res) => {
  res.render('home', {
      isAuthenticated: req.isAuthenticated,
      userInfo: req.session.userInfo
  });
});


app.get('/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
      scope: 'phone openid email',
      state: state,
      nonce: nonce,
  });

  res.redirect(authUrl);
});

// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
  try {
      const url = new URL(urlString);
      return url.pathname;
  } catch (error) {
      console.error('Invalid URL:', error);
      return null;
  }
}

app.get(getPathFromURL('https://d84l1y8p4kdic.cloudfront.net'), async (req, res) => {
  try {
      const params = client.callbackParams(req);
      const tokenSet = await client.callback(
          'https://d84l1y8p4kdic.cloudfront.net',
          params,
          {
              nonce: req.session.nonce,
              state: req.session.state
          }
      );

      const userInfo = await client.userinfo(tokenSet.access_token);
      req.session.userInfo = userInfo;

      res.redirect('/');
  } catch (err) {
      console.error('Callback error:', err);
      res.redirect('/');
  }
});


// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  const logoutUrl = `https://<user pool domain>/logout?client_id=3ofju9bq077uisvcv18aj8lrsn&logout_uri=<logout uri>`;
  res.redirect(logoutUrl);
});

// 🔹 Start Server
app.listen(3000, () => {
  const now = new Date();
  console.log(`🕒 Started at: ${now.getMinutes()}:${now.getSeconds()}`);
  console.log('-: App Running on http://localhost:3000 :-');
});
