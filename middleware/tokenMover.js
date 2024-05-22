// Token Verification Function
function verifyToken(req, res, next) {
  // Get auth header value
  const barerHeader = req.headers['cookie'];

  // Check if barerHeader is undefined
  if (typeof barerHeader !== 'undefined') {
    // Split at the space
    const barer = barerHeader.split(' ');

    // Get token from array
    const barerToken = barer[1];

    // Set the token
    req.token = barerToken;
    next();
  } else {
    // Forbidden
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
};

module.exports = verifyToken;
