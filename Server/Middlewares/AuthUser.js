import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const { token } = req.cookies;

  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: `Unauthorized! Login Again`, success: false });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.id) req.body.userID = decodedToken.id;
    else
      return res.status(401).json({ message: `Unauthorized!`, success: false });
    console.log("Leaving Middleware");
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error ${error.message},success:false`,
    });
  }
};
