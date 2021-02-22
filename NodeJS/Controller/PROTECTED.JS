let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
    if(req.headers.authorization!==null || typeof req.headers.authorization !== "undefined"){
    res.json(req.decoded);
    }
    else{
        res.json({"msg":"Access failed."});
    }
});


module.exports = router;