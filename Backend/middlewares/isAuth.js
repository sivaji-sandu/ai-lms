import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // safer way to access cookie

    if (!token) {
      return res.status(400).json({ message: "No token found. Please log in." });
    }

    // ✅ Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(400).json({ message: "Invalid token. Please log in again." });
    }

    // Attach userId for later use
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("isAuth error:", error);
    return res.status(401).json({ message: "Unauthorized. Token verification failed." });
  }
};

export default isAuth;
