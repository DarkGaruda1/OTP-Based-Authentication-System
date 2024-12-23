import transporter from "../../Config/Nodemailer.js";
import { dateAndTimeGenerate } from "../../Helpers/generateDateAndTime.js";
import User from "../../Model/UserModel.js";
import { validateEmail } from "../../Validations/ValidateEmail.js";
import { validatePassword } from "../../Validations/ValidatePassword.js";
import bcrypt from "bcrypt";

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: `None of the required fields can be empty`,
      success: false,
    });
  }

  // Validations

  if (!validateEmail(email))
    return res.status(400).json({
      message: `Invalid Email`,
      success: false,
    });

  if (!validatePassword(newPassword))
    return res.status(400).json({
      message: `Password doesnt satisfy requirments`,
      success: false,
    });

  try {
    // Check if user exists with same email or username

    const userExists = await User.findOne({ email });

    if (!userExists)
      return res.status(400).json({
        message: `Username or Email ID not associated with any account`,
        success: false,
      });

    if (
      userExists.passwordResetOTP !== otp ||
      userExists.passwordResetOTP === ""
    )
      return res
        .status(400)
        .json({ message: `OTP is invalid. Try Again`, success: false });

    if (userExists.passwordResetOTPExpireAt < Date.now())
      return res.status(400).json({
        message: `OTP Expired. Try To Verify Once Again`,
        success: false,
      });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    userExists.password = hashedPassword;

    userExists.accountUpdatedAt = dateAndTimeGenerate();
    userExists.passwordResetOTP = "";
    userExists.passwordResetOTPExpireAt = 0;

    await userExists.save();

    const mailOptions = {
      from: {
        name: "Cricketer Management System",
        address: process.env.SMTP_Sender_Email,
      },
      to: email,
      subject: `Password Reset Successful | You Have Successfully Changed The Password`,
      text: `Your password has been reset successfully.Account Updated At ${userExists.accountUpdatedAt} `,
    };

    transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: `Password Successfully Updated`,
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
