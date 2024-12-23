import transporter from "../../Config/Nodemailer.js";

import User from "../../Model/UserModel.js";
import { validateEmail } from "../../Validations/ValidateEmail.js";
import { validatePassword } from "../../Validations/ValidatePassword.js";
import { validateUsername } from "../../Validations/ValidateUserName.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name || !password || !email || !username)
    return res.status(400).json({
      message: `None of the required fields can be empty`,
      success: false,
    });

  // Validations

  if (!validateEmail(email))
    return res.status(400).json({
      message: `Invalid Email`,
      success: false,
    });

  if (!validateUsername(username))
    return res.status(400).json({
      message: `Username doesnt satisfy requirements`,
      success: false,
    });

  if (!validatePassword(password))
    return res.status(400).json({
      message: `Password doesnt satisfy requirments`,
      success: false,
    });

  try {
    // Check if user exists with same email or username

    const userExistsWithEmail = await User.findOne({ email });

    if (userExistsWithEmail)
      return res.status(400).json({
        message: `User Already Exists With This Email`,
        success: false,
      });
    const userExistsWithUsername = await User.findOne({ username });
    if (userExistsWithUsername)
      return res.status(400).json({
        message: `User Already Exists With This Username`,
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const savedUser = await User.findOne({ email, username });

    const mailOptions = {
      from: {
        name: "Cricketer Management System",
        address: process.env.SMTP_Sender_Email,
      },
      to: email,
      subject: `Welcome To Cricketer Management System`,
      text: `Account has been created with email id ${email} and username ${username}. Account Created At ${savedUser.accountCreatedAt} `,
    };

    transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: `New User Successfully Created`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error - ${error.message}`,
      success: false,
    });
  }
};
