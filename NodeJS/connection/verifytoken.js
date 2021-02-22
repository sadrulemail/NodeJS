var jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = function(req,res,next) {
  //var token = req.body.token || req.query.token || req.headers['x-access-token']||req.headers.authorization !== "undefined";
  if( typeof req.headers.authorization !== "undefined"){
  let token = req.headers.authorization.split(" ")[1];
    if (token) {
    // verifies secret and checks exp
        jwt.verify(token, process.env.SECRET_KEY, { algorithm: process.env.ENCRYPTION_ALG },function(err, decoded) {
            
           
            if (err) { //failed verification.
                return res.json({"error": true,"Message":"Token verification failed!"});
       
            }
            // const now = Date.now().valueOf() / 1000;
            // if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            //     return res.json({"error": true,"Message":"Token expired!"});
            //     //throw new Error(`token expired: ${JSON.stringify(decoded)}`)
            // }
            // if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            //     throw new Error(`token expired: ${JSON.stringify(decoded)}`)
            // }

            req.decoded = decoded;
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        return res.status(403).send({
            "error": true,"Message":"Unauthorize access!"
        });
    }
  }
}