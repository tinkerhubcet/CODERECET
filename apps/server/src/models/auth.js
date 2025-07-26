import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";
import { ErrorHandler } from "#middlewares";
import { User } from "#models";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const AuthToken = Sequelize.define("AuthToken", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        set(token) {
            this.setDataValue("token", bcrypt.hashSync(token, 12));
        },
    },
    expiresOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

AuthToken.getAccessToken = async (user, refreshToken) => {
    if (!user?.id) {
        return new ErrorHandler(401, "Invalid user", null);
    }
    const fetchUser = await User.findOne({
        where: { id: user.id },
    });
    if (!fetchUser?.id) {
        return new ErrorHandler(401, "Not authorized", null);
    }
    const authToken = await AuthToken.findOne({
        where: {
            userId: fetchUser.id,
        },
    });
    if (!authToken) {
        return new ErrorHandler(401, "No refresh token found", null);
    }
    if (!(await bcrypt.compare(refreshToken, authToken.token))) {
        return new ErrorHandler(401, "Invalid refresh token", null);
    }
    if (!authToken.token || authToken.expiresOn < new Date().getTime()) {
        return new ErrorHandler(401, "Refresh token expired", null);
    }
    const accessTokenContent = {
        id: fetchUser.id,
        jti: uuid(),
    };
    try {
        const accessToken = jwt.sign(
            { ...accessTokenContent },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRY,
                algorithm: "HS256",
            },
        );
        return accessToken;
    } catch (error) {
        return new ErrorHandler(500, "Failed to generate access token", error);
    }
};

AuthToken.getRefreshToken = async (user) => {
    if (!user?.id) {
        return new ErrorHandler(401, "Invalid user", null);
    }
    const fetchedUser = await User.findOne({ where: { id: user.id } });
    if (!fetchedUser?.id) {
        return new ErrorHandler(401, "No user found", null);
    }

    try {
        const refreshToken = uuid();
        const expiresOn = new Date(
            new Date().getTime() +
                parseInt(process.env.JWT_REFRESH_EXPIRY) * 1000,
        );
        const fetchedToken = await AuthToken.findOne({
            where: { userId: fetchedUser.id },
        });
        if (fetchedToken) {
            fetchedToken.token = refreshToken;
            fetchedToken.expiresOn = expiresOn;
            await fetchedToken.save();
            return refreshToken;
        }
        await AuthToken.create({
            userId: fetchedUser.id,
            token: refreshToken,
            expiresOn,
        });
        return refreshToken;
    } catch (error) {
        return new ErrorHandler(500, "Failed to generate refresh token", error);
    }
};

AuthToken.verifyToken = async (token) => {
    if (!token) {
        return new ErrorHandler(401, "No token provided", null);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findOne({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            return new ErrorHandler(401, "User not found", null);
        }
        return decoded;
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return new ErrorHandler(401, "Invalid token", null);
        }
        if (error.name === "TokenExpiredError") {
            return new ErrorHandler(401, "Token expired", null);
        }
        return new ErrorHandler(500, "Error verifying token", error);
    }
};

AuthToken.verifyRefreshToken = async (accessToken, token) => {
    let decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET,
        (err, decoded) => {
            if (err && err.name !== "TokenExpiredError") {
                return new ErrorHandler(
                    500,
                    err?.name || "Error verifying token",
                    err,
                );
            }
            return jwt.decode(accessToken);
        },
    );
    if (decoded instanceof ErrorHandler) {
        return decoded;
    }
    const userId = decoded.id;
    const fetchedUser = await User.findOne({ where: { id: userId } });
    if (!fetchedUser?.id) {
        return new ErrorHandler(401, "No user found", null);
    }
    if (!token) {
        return new ErrorHandler(401, "No token provided", null);
    }
    try {
        const refreshToken = await AuthToken.findOne({
            where: {
                userId: fetchedUser.id,
            },
        });
        if (!refreshToken) {
            return new ErrorHandler(401, "No refresh token found", null);
        }
        if (refreshToken.expiresOn < new Date()) {
            return new ErrorHandler(401, "Token expired", null);
        }
        if (!(await bcrypt.compare(token, refreshToken.token))) {
            return new ErrorHandler(401, "Token Error", null);
        }
        const user = await User.findOne({
            where: {
                id: refreshToken.userId,
            },
        });
        if (!user) {
            return new ErrorHandler(404, "User not found", null);
        }
        return { id: user.id };
    } catch (error) {
        return new ErrorHandler(500, "Internal server error", error);
    }
};

export default AuthToken;
