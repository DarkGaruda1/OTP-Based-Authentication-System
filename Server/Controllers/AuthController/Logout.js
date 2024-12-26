export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res
      .status(200)
      .json({ message: `User Logged Out Successfully`, success: true });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error ${error.message}`,
      success: false,
    });
  }
};
