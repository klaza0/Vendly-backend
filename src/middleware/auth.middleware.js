const jwt = require("jsonwebtoken");

exports.authMiddleware = (requiredRoles = []) => (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ 
            message: "Unauthorized",
            error: "No authorization header provided. Please add: Authorization: Bearer <token>"
        });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ 
            message: "Unauthorized",
            error: "No token provided. Format should be: Authorization: Bearer <token>"
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set in environment variables");
        return res.status(500).json({ 
            message: "Server configuration error",
            error: "JWT_SECRET is missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (decoded.subscription_status !== "Active") {
            return res.status(403).json({ 
                message: "Subscription expired",
                error: "Your subscription is not active"
            });
        }

        if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
            return res.status(403).json({ 
                message: "Forbidden",
                error: `Access denied. Required roles: ${requiredRoles.join(", ")}. Your role: ${decoded.role}`
            });
        }

        next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ 
                message: "Token expired",
                error: "Your token has expired. Please login again"
            });
        } else if (e.name === "JsonWebTokenError") {
            return res.status(401).json({ 
                message: "Invalid token",
                error: "Token is invalid or malformed"
            });
        } else {
            return res.status(401).json({ 
                message: "Authentication failed",
                error: e.message
            });
        }
    }
};
