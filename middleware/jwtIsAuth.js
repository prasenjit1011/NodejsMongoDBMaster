
module.exports = (req, res, next) => {

    console.log('-: jwt Is Auth check :-');
    const jwt               = require('jsonwebtoken');
    const authorization     = req.get('Authorization');
    const token             = authorization.split(' ')[1];
    
    try{
        data = jwt.verify(token, 'mysecret');
        console.log('\n\n Data : ');
        console.log(data);
    }
    catch(err){
        let data = {staus:401, msg : 'Not authenticated'};
        return res.json(data);
    }
    
    next();
}