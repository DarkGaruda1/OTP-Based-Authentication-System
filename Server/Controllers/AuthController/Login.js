import User from "../../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dateAndTimeGenerate } from "../../Helpers/generateDateAndTime.js";

export const login = async (req, res) => {
  const { email, password, username } = req.body;

  if (!password || !email || !username)
    return res.status(400).json({
      message: `None of the required fields can be empty`,
      success: false,
    });

  try {
    const userExists = await User.findOne({ email, username });

    if (!userExists)
      return res.status(400).json({
        message: `Username or Email ID not associated with any account`,
        success: false,
      });

    const isPasswordMatch = await bcrypt.compare(password, userExists.password);

    if (!isPasswordMatch)
      return res.status(400).json({
        message: `Invalid Login Credentials`,
        success: false,
      });

    userExists.accountLastLogin = dateAndTimeGenerate();
    await userExists.save();

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxage: 24 * 7 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: `User Logged In Successfully`, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error - ${error.message}`,
      success: false,
    });
  }
};
