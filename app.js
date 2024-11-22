console.log('\n\n-: App Started :-');

const express       = require('express');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const MONGODB_URI   = "mongodb+srv://tester:tester1234@cluster0.hlicuim.mongodb.net/demat?retryWrites=true&w=majority";//&replicaSet=rs0";
//https://cloud.mongodb.com/
//Login with prasenjit.aluni@gmail.com
//Prasenjit's Org - 2021-07-09
//project01
//Cluster->Browse Collection->demat
//git push https://prasenjit1011:ACCESS_TOKEN@github.com/prasenjit1011/NodeJSMongoDBMaster
//https://github.com/settings/tokens?type=beta


const app   = express();

app.use(express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const multer        = require('multer');
const fileStorage   = multer.diskStorage({
                                destination: 'public/tradebook',
                                filename: (req, file, cb) => { cb(null, parseInt(100*Math.random())+'-'+file.originalname); }
                            });


const fileFilter = (req, file, cb) => {
    cb(null, true);
                                        //if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) { cb(null, true); } 
                                        //else { cb(null, false); }
                                    };
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('tradebook'));

const stock = require('./routes/stockapi');
app.use(stock);


app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    res.send('-: Welcome :-');
    next();
});

console.log('-: App Running :-');



/////app.listen(3000);///
mongoose.connect(MONGODB_URI)
        .then(result =>{ console.log("-: MongoDB connected :-"); app.listen(3000)})
        .catch(err=>{console.log('MongoDB not connected'); console.log(err)});
