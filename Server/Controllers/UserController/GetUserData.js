import User from "../../Model/UserModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await User.findById(userID);

    if (!user)
      return res
        .status(404)
        .json({ message: `User Not Found`, success: false });

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error - ${error.message}`,
      success: false,
    });
  }
};
