import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    // Check if token exists
    if (!token) {
        console.log("No token provided");
        return res.json({ success: false, message: "Not authorized. Please log in again." });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
        console.log("JWT_SECRET is not set in environment variables");
        return res.json({ success: false, message: "Server configuration error" });
    }

    try {
        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", token_decode);

        // Check if token has valid id
        if (!token_decode._id && !token_decode.id) {
            console.log("Token missing user ID");
            return res.json({ success: false, message: "Invalid token. Please log in again." });
        }

        // Attach userId to the request object (check both _id and id)
        req.body.userId = token_decode._id || token_decode.id;
        next();

    } catch (error) {
        console.log("Auth error:", error.name, error.message);
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: "Session expired. Please log in again." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: "Invalid token. Please log in again." });
        }
        return res.json({ success: false, message: "Authentication failed. Please log in again." });
    }
};

export default authMiddleware;
