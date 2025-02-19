module.exports.createPost = (req,res,next) => {
  if(!req.body.title){
    req.flash("error", "Vui lòng nhập vào nội dung")
    res.redirect(`back`);
    return;
  }
  next();
}