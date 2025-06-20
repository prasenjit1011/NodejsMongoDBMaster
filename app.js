console.clear();
console.log('\n\n-: App Started :-');





const express   = require('express');
const session   = require('express-session');
const { Issuer, generators } = require('openid-client');

const app       = express();

let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_7Z77Gffng');
    client = new issuer.Client({
        client_id: '22h45k0pj9qmht7ocd7gvuj4ks',
        client_secret: '<client secret>',
        redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net','http://localhost:8040/callback'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);
app.set('view engine', 'ejs');
app.use(session({
    secret: 'test123test123',
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
// Use a literal so the route is clear and you don’t need getPathFromURL()
app.get('/callback', async (req, res) => {
    try {
      const params    = client.callbackParams(req);
      const tokenSet  = await client.callback(
        `${req.protocol}://${req.get('host')}/callback`,
        params,
        { nonce: req.session.nonce, state: req.session.state }
      );
  
      req.session.userInfo = await client.userinfo(tokenSet.access_token);
  
      // 🔑 send them to the dashboard
      res.redirect('/dashboard');
    } catch (err) {
      console.error('Callback error:', err);
      res.redirect('/');
    }
  });
  

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
    const logoutUrl = `https://<user pool domain>/logout?client_id=22h45k0pj9qmht7ocd7gvuj4ks&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
});


app.get('/dashboard', checkAuth, (req, res) => {
    if (!req.isAuthenticated) return res.redirect('/login');
  
    // Render whatever view/component you like
    res.render('dashboard', {
      userInfo: req.session.userInfo
    });
  });

// app.use('/', (req, res, next)=>{
//     console.log('-: Welcome :-');
//     res.send('-: Welcome :-');

//     next()
// });

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('Central Error Handler:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

console.log('-: App Running :-');
app.listen(8040);