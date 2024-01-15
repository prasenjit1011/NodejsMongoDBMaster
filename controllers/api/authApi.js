const jwt = require('jsonwebtoken');

exports.getLogin = (req, res, next) => {

    const userdata  = { 'name': 'PrasenjitAluni', 'designation':'Developer' };
    const token     = jwt.sign(userdata, 'mysecret', { expiresIn: '1h' });
    const data      = {JWT_Token:token};

    return res.json(data);
}


exports.getAccount = (req, res, next) => {

    const authorization     = req.get('Authorization');
    const token     = authorization.split(' ')[1];
    const data      = jwt.verify(token, 'mysecret');

    return res.json(data);
}