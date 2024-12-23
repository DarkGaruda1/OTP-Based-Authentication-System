import transporter from "../../Config/Nodemailer.js";
import { dateAndTimeGenerate } from "../../Helpers/generateDateAndTime.js";
import User from "../../Model/UserModel.js";

export const sendVerificationOTP = async (req, res) => {
  const { userID } = req.body;

  if (!userID)
    return res
      .status(400)
      .json({ message: ` UserID Is Missing`, success: false });

  const loggedInUser = await User.findById(userID);

  const { email, username } = loggedInUser;

  if (!loggedInUser)
    return res.status(404).json({ message: `User Not Found`, success: false });
  console.log(loggedInUser);

  if (loggedInUser.isAccountVerified)
    return res
      .status(200)
      .json({ message: `Account Is Already Verified`, success: true });

  const otp = String(Math.floor(10000000 + Math.random() * 90000000));

  loggedInUser.accountVerificationOTP = otp;

  loggedInUser.accountVerificationOTPExpireAt =
    Date.now() + 24 * 60 * 60 * 1000;

  loggedInUser.accountUpdatedAt = dateAndTimeGenerate();

  await loggedInUser.save();

  const mailOptions = {
    from: {
      name: "Cricketer Management System",
      address: process.env.SMTP_Sender_Email,
    },
    to: email,
    subject: `Verify Account | Use The Following OTP For Account Verification`,
    text: ` Hello ${username}, Use this OTP is ${otp} for verifying your account. This OTP is valid for 24 hours from now.  `,
  };

  transporter.sendMail(mailOptions);

  return res
    .status(201)
    .json({ message: `OTP Generated And Sent To Email ID`, success: true });
};
