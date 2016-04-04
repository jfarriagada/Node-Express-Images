var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var User = require("./models/user").User;
var session = require("express-session");
var routers_app = require("./routers_app");
var session_middleware = require("./middlewares/session");
// passport
//var passport = require('passport');
//var localStrategy = require('passport-local').Strategy;


// middleware son funciones app.use()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//Autenticacion con passport
//app.use(passport.initialize());
//app.use(passport.session());

app.use(session({
  secret: "konarrsecretjjanxlajakn",
  resave: true, // updatea la sesion en cada cambio de route
  saveUninitialized:false // ahorra espacio en la db, no guarda sessiones
}));

app.set("view engine","jade");

// ROUTING
app.get("/",function(req,res){
  //res.send("hola konarr desde express !!");
  console.log("session index :" + req.session.user_id);
  res.render("index",{name: "KONARRJS"});
});

app.post("/",function(req,res){
  res.render("form");
});

// hace solo el render de una url qr o una url qrname
app.get("/qr:name", function(req,res){
  res.render("qr",{name:req.params.name});
  //res.send(req.params.name);
});

app.get("/qr", function(req,res){
  res.render("qr");
});

app.get("/signup",function(req,res){
  User.find(function(err,doc){
    console.log(doc);
    res.render("signup");
  });
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/users", function(req,res){

  var user = new User({
        email: req.body.email,
        username: req.body.username,
        password:req.body.password,
        password_confirmation:req.body.password_confirmation
  });
  console.log(user.password_confirmation);
  // Las acciones con la db son las que deben ser Asincronas

  // Asincrona con callbacks
  /*user.save(function(err){
    if(err){
      console.log("Error validaciion : " +String(err));
    }
    res.send("Guardamos tus Datos :D");
  });*/

  // Asincrona con promises
  user.save().then(function(us){
    res.send("Guardamos el usuario exitosamente");
  },function(err){
    if(err){
      console.log(String(err));
      res.send("Error, no pudimos guardar la información.");
    }
  });

  console.log("Email " +req.body.email);
  console.log("Password " +req.body.password);
});

app.post("/sessions", function(req,res){
  //find devuleve un collection y findOne un documento
  User.findOne({
    email:req.body.email,
    password: req.body.password
  },function(err,user){
    res.send("Logueado :D");
    // las sesiones de express no son recomendable para produccion
    req.session.user_id = user._id;
    console.log("sessions id :" + String(user._id));
    console.log("req id: " + String(req.session.user_id));
  });
});

// Prefijo de rutas
app.use("/app",session_middleware);
app.use("/app",routers_app);

app.listen(8080);
