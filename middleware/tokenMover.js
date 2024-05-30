// Token Verification Function
function verifyToken(req, res, next) {
  // Get auth header value
  console.log(req.cookies);
  if (req.cookies != undefined) {
    const barerHeader = req.cookies['Barer'];

    // Check if barerHeader is undefined
    if (typeof barerHeader !== 'undefined') {
      req.token = barerHeader;
      next();
    } else {
      // Unauthorized
      res.status(401).json({
        success: false,
        message: "Unauthorized: tokenMover1",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized: tokenMover2"
    });
  }
};

module.exports = verifyToken;
