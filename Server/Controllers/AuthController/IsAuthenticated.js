export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ message: "Authenticated", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal Server Error - ${error.message}`,
      success: false,
    });
  }
};
