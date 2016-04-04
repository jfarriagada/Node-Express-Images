var express = require("express");
var router = express.Router();

// .com/app/
router.get("/",function(req,res){
  res.render("app/home");
});

// Se exporta para que se pueda importar desde otros archivos
module.exports = router;
