import transporter from "../../Config/Nodemailer.js";
import { dateAndTimeGenerate } from "../../Helpers/generateDateAndTime.js";
import User from "../../Model/UserModel.js";

export const verifyAccount = async (req, res) => {
  const { userID, otp } = req.body;

  if (!userID || !otp) {
    return res
      .status(400)
      .json({ message: ` UserID or OTP Is Missing`, success: false });
  }

  try {
    const unverifiedUser = await User.findById(userID);

    const { username, email } = unverifiedUser;

    if (unverifiedUser.isAccountVerified)
      return res
        .status(200)
        .json({ message: `Account Is Already Verified`, success: true });

    if (
      unverifiedUser.accountVerificationOTP === "" ||
      unverifiedUser.accountVerificationOTP !== otp
    )
      return res
        .status(400)
        .json({ message: `OTP is invalid. Try Again`, success: false });

    if (unverifiedUser.accountVerificationOTPExpireAt < Date.now())
      return res.status(400).json({
        message: `OTP Expired. Try To Verify Once Again`,
        success: false,
      });

    unverifiedUser.isAccountVerified = true;
    unverifiedUser.accountVerificationOTPExpireAt = 0;
    unverifiedUser.accountVerificationOTP = "";

    await unverifiedUser.save();

    const mailOptions = {
      from: {
        name: "Cricketer Management System",
        address: process.env.SMTP_Sender_Email,
      },
      to: email,
      subject: `Account Verification Successful`,
      text: ` Hello ${username}, Your account is verified successfully On ${dateAndTimeGenerate()} `,
    };

    transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: `Account Has Been Verified`,
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
