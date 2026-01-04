const jwt = require("jsonwebtoken");

exports.authMiddleware = (requiredRoles = []) => (req,res,next)=>{
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if(decoded.subscription_status !== "Active"){
            return res.status(403).json({ message: "Subscription expired" });
        }

        if(requiredRoles.length && !requiredRoles.includes(decoded.role)){
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    } catch(e){
        return res.status(401).json({ message: "Invalid Token" });
    }
};
