import jwt from "jsonwebtoken";
import { User, AuthToken } from "#models";
import { ErrorHandler, asyncErrorHandler } from "#middlewares";

const authHandler = asyncErrorHandler(async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token || token === "undefined") {
        return next(new ErrorHandler(404, "Auth token not found", null));
    }
    const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        (err, decoded) => {
            if (err) return next(new ErrorHandler(401, err.name, null));
            return decoded;
        },
    );
    const user = await User.findOne({ where: { id: decoded.id } });
    if (decoded.adminId) user.adminId = decoded.adminId;
    if (!user) {
        return next(new ErrorHandler(404, "User not found", null));
    }

    const authToken = await AuthToken.verifyToken(token);
    req.user = authToken;
    if (authToken instanceof ErrorHandler) return next(authToken);
    next();
});

export default authHandler;
