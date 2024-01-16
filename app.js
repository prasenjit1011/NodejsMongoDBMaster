console.log('\n\n-: App Started :-');

const express       = require('express');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const session       = require('express-session');
const mongodbStore  = require('connect-mongodb-session')(session);

//const cookieParser  = require('cookie-parser');
const csrf          = require('csurf')
const csrfProtect   = csrf();//{ cookie: true }

const mongoConnect  = require('./util/database').mongoConnect;
const MONGODB_URI   = "mongodb+srv://tester:tester1234@cluster0.hlicuim.mongodb.net/Mydb?retryWrites=true&w=majority";
const store         = new mongodbStore({ uri: MONGODB_URI, collection: 'sessions' });
const params        = { secret: 'my-secret', resave: false, saveUninitialized: false, store: store };

const multer        = require('multer');
const fileStorage   = multer.diskStorage({
                                destination: 'images',
                                filename: (req, file, cb) => { cb(null, parseInt(100*Math.random())+'-'+file.originalname); }
                            });


const fileFilter = (req, file, cb) => {
                                        if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) { cb(null, true); } 
                                        else { cb(null, false); }
                                    };


const app   = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session(params));
app.use(csrfProtect);

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('ProductImage'));


const shop = require('./routes/shop');
app.use(shop);

const product = require('./routes/product');
app.use(product);

const auth = require('./routes/auth');
app.use(auth);

const article = require('./routes/article');
app.use(article);

const item = require('./routes/item');
app.use(item);

app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    //res.send('-: Welcome :-');
    res.render('home', {sessionData:req.session});
});



console.log('-: App Running :-');
mongoConnect(()=>app.listen(3000));

mongoose.connect(MONGODB_URI)
        .then(result =>{ 
            console.log('-: Listening port 3001 :-')
            const server    = app.listen(3001);
            const socketio  = require('socket.io')(server);
            socketio.on('connection', socket => {
                console.log('-: Client Connected :-');
            });
        })
        .catch(err=>console.log(err));

