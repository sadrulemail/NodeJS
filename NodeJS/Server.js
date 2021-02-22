var express=require('express');
var app=express();
var port=process.env.port || 8000;
var jwt = require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
require('dotenv').config();



var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());

var productController = require('./Controller/ProductController')();
//app.use("/api/products",isAuthenticated,productController);

app.use("/api/products",productController);

let verifyToken = require('./connection/verifytoken');
let middleware = require('./Controller/middleware');
const errorHandler = require('./connection/errorhandler');

app.use('/protected', verifyToken, require('./Controller/protected'));


// app.get("/product",isAuthenticated,function(request,response)
// {
//     response.json({"Message":"Welcome to Node js API"});
// });

app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message});
      logger.error(err);
      return;
    }
 next();
});

app.get("/product",middleware.checkToken,function(request,response)
{
    //request.decoded;
    //response.json({"Message":"Welcome to Node js API"});
    response.json(request.decoded);
});

app.get('/jwt', (req, res) => {
    
    //let privateKey = fs.readFileSync('./private.pem', 'utf8');
    //const  expiresIn  =  24  *  60  *  60;//24 for hours
    const  expiresIn  =   8*60*60;//24 for hours
    //let token = jwt.sign({ "EmpID": "2217","Division:":"IT Division","BranchID:":"0001" }, 
    //privatekey, { algorithm: encryptionAlg});
    var roles="User";

    const  accessToken  =  jwt.sign({ "EmpID": "2217","Division:":"IT Division","BranchID:":"0001",
    "roles":roles }, process.env.SECRET_KEY, {
        expiresIn:  expiresIn
    });
    //res.json({"token:":token,"test:":"sadrul"});
    res.status(200).json({ "user":  "Sadrul", "access_token":  accessToken, "expires_in":  expiresIn          
            });      
})

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        //let privateKey = fs.readFileSync('./private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, process.env.SECRET_KEY, { algorithm: process.env.EncryptionAlg },
         (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized-Inner" });
                //throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        res.status(500).json({ error: "Not Authorized-Outer" });
        //throw new Error("Not Authorized");
    }
}
// global error handler
app.use(errorHandler);

app.listen(port,function(){
    var datetime=new Date();
    var message="Server running on port:-"+port+" Started at:-"+datetime;
    console.log(message);
})
