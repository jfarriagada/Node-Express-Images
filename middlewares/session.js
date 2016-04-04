module.exports = function(req,res,next){
  console.log("req id session: " + String(req.session.username));
  if(!req.session.user_id){
    res.redirect("/login")
  }else{
    // siguiente middleware
    next();
  }
}
