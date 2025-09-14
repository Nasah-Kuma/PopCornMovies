module.exports = function (req, res, next) {
    //401:Unauthorized, when user tries to access a resource without authentication
    //403:forbidden, when user is authenticated but not authorized
    
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  next();
}