console.clear();
console.log('\n\n-: App Started :-');

const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- SESSION CONFIG ----------
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // true in production with HTTPS
    httpOnly: true
  }
}));

// ---------- OPENID CLIENT INIT ----------
let client;
let codeVerifier;

(async () => {
  const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXNB8qhQ2');

  client = new issuer.Client({
    client_id: '3ofju9bq077uisvcv18aj8lrsn',
    client_secret: '12o7ehteids6lhr4dci52fkcjhfn3nci7uu77bnqg9630ic65s9p',
    redirect_uris: ['http://localhost:3000/callback'],
    response_types: ['code']
  });
})();

// ---------- CUSTOM AUTH CHECK ----------
app.use((req, res, next) => {
  req.isAuthenticated = () => !!req.session.user;
  next();
});

// ---------- ROUTES ----------

// Home/Login
app.get('/', (req, res) => {
    //res.send('helllo')
    res.render('login');
});

// Start Login (redirect to Cognito)
app.get('/login', (req, res) => {
  codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const authUrl = client.authorizationUrl({
    scope: 'email openid',    
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  res.redirect(authUrl);
});

// Cognito Callback
app.get('/callback', async (req, res, next) => {
  try {
    const params = client.callbackParams(req);

    console.log('---params---');
    console.log(params);
    const tokenSet = await client.callback('http://localhost:3000/callback', params, {
      code_verifier: codeVerifier
    });

    console.log(tokenSet.claims());
    req.session.user = tokenSet.claims(); // Save user to session
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

// Dashboard (protected)
app.get('/dashboard', (req, res) => {
    console.log('---->>>', req.isAuthenticated())
  if (!req.isAuthenticated()) return res.redirect('/');
  res.render('dashboard', { user: req.session.user });
});

// Logout
app.get('/logout', (req, res) => {
  const logoutUrl = `https://us-east-1xxnb8qhq2.auth.us-east-1.amazoncognito.com/logout?client_id=3ofju9bq077uisvcv18aj8lrsn&logout_uri=http://localhost:3000`; 
  req.session.destroy(() => res.redirect(logoutUrl));
});

// Start Server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
