var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos");

// Las validaciones de hacen en el schema
//email:String,
// undefined respeta el required true, puede ir
// required:true o bien un msg
//min:5,max:100 o msg
var var_sex = ["M","F"];

var user_schema = new Schema({
  username: {type:String,maxlenght:[10,"username muy largo."]},
  password:{
    type:String,
    minlength:[8,"min 8 caracteres"],
    validate:{
      validator: function(pwd){
        return this.password_confirmation == pwd;
      },
      message:"Las contraseñas no son iguales"
    },
  },
  email:{type:String,required:"Correo obligatorio",
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "email invalido"]},
  age:{type:Number,min:[5,"minimo 5"],max:[100,"max 100"]},
  date_of_birth:Date,
  sex:{type:String,enum:{values:var_sex,message:"opcion no valida"}}
});


/* Los Virtuals son propiedades de un documento y se
utilizan para validaciones
documento es el objeto de una collecion en mongodb */
user_schema.virtual("password_confirmation").get(function(){
  return this.pwd_confirmation;
}).set(function(password){
  this.pwd_confirmation = password;
});

var User = mongoose.model("User",user_schema);
module.exports.User = User;
