import transporter from "../../Config/Nodemailer.js";
import User from "../../Model/UserModel.js";

export const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: `Email is required` });

  try {
    const userExists = await User.findOne({ email });

    if (!userExists)
      return res.status(404).json({
        success: false,
        message: `No User Found Associated With Given Email Id`,
      });

    const { username } = userExists;

    const otp = String(Math.floor(10000000 + Math.random() * 90000000));

    userExists.passwordResetOTP = otp;

    userExists.passwordResetOTPExpireAt = Date.now() + 15 * 60 * 1000;

    await userExists.save();

    console.log("OTP Gen Complete Sending Mail");

    const mailOptions = {
      from: {
        name: "Cricketer Management System",
        address: process.env.SMTP_Sender_Email,
      },
      to: email,
      subject: `Password Reset | Use The Following OTP For Resetting Your Password`,
      text: ` Hello ${username}, Use this OTP is ${otp} for resetting your password. This OTP is valid for 15 minutes from now.  `,
    };

    // transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ message: `OTP Generated And Sent To Email ID`, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error - ${error.message}`,
      success: false,
    });
  }
};
