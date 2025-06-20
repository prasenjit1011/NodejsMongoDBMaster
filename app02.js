const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const app = express();

let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXNB8qhQ2');
    client = new issuer.Client({
        client_id: '3ofju9bq077uisvcv18aj8lrsn',
        client_secret: '12o7ehteids6lhr4dci52fkcjhfn3nci7uu77bnqg9630ic65s9p',
        redirect_uris: ['http://localhost:3000/dashboard'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);
//'https://d84l1y8p4kdic.cloudfront.net'



app.use(session({
    secret: '147852369',
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
        scope: 'email openid phone',
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
    const logoutUrl = `https://us-east-1xxnb8qhq2.auth.us-east-1.amazoncognito.com/logout?client_id=3ofju9bq077uisvcv18aj8lrsn&logout_uri=http://localhost:3000/logout`;
    res.redirect(logoutUrl);
});



app.get('/dashboard', checkAuth, (req, res) => {
    console.clear();
    console.log('-------------------------------------------')
    console.log('-------------------------------------------')
    console.log('-------------------------------------------')
    let dtd = new Date();
    console.log('--------- '+dtd.getMinutes()+':'+dtd.getSeconds()+' ========');
    console.log(req.isAuthenticated);
    console.log(req.session.userInfo);
    console.log('-------------------------------------------')
    console.log('-------------------------------------------')

    console.log('\n\n');
    res.render('dashboard', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo
    });
});


app.set('view engine', 'ejs');
// 🔹 Start Server
app.listen(3000, () => {
    const now = new Date();
    console.log(`🕒 Started at: ${now.getMinutes()}:${now.getSeconds()}`);
    console.log('-: App Running on http://localhost:3000 :-');
  });
  