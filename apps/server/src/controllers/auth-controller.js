import { asyncErrorHandler, ErrorHandler } from "#middlewares";
import { User, AuthToken } from "#models";

const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: { email },
    });
    if (!user) {
        return next(new ErrorHandler(401, "Invalid email or password", null));
    }
    if (!(await user.comparePassword(user, password))) {
        return next(new ErrorHandler(401, "Invalid email or password", null));
    }
    const refreshToken = await AuthToken.getRefreshToken(user);
    if (refreshToken instanceof ErrorHandler) {
        return next(refreshToken);
    }
    const accessToken = await AuthToken.getAccessToken(user, refreshToken);
    if (accessToken instanceof ErrorHandler) {
        return next(accessToken);
    }

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRY) * 1000,
        path: "/",
    });

    res.status(200).json({
        ok: true,
        message: "Logged in successfully",
        data: { accessToken },
    });
});

const register = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
        return next(new ErrorHandler(400, "email already exists", null));
    }
    const newUser = await User.create({ email, password });
    await newUser.save();
    res.status(201).json({
        ok: true,
        message: "Registered successfully",
        data: null,
    });
});

const logout = asyncErrorHandler(async (req, res, next) => {
    if (!req.user?.id) {
        return next(new ErrorHandler(401, "Id not defined", null));
    }
    const { id: userId } = req.user;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return next(new ErrorHandler(401, "User not found", null));
    }
    req.clearCookie("refreshToken");
    await AuthToken.destroy({ where: { userId } });
    res.status(201).json({
        ok: true,
        message: "Logged out successfully",
        data: null,
    });
});

const refresh = asyncErrorHandler(async (req, res, next) => {
    let { refreshToken } = req.cookies;
    let accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return next(new ErrorHandler(401, "No access token found", null));
    }
    if (!refreshToken) {
        return next(new ErrorHandler(401, "No refresh token found", null));
    }
    const refreshTokenVerify = await AuthToken.verifyRefreshToken(
        accessToken,
        refreshToken,
    );
    if (refreshTokenVerify instanceof ErrorHandler) {
        return next(
            new ErrorHandler(
                refreshTokenVerify.code,
                refreshTokenVerify.message,
                null,
            ),
        );
    }
    if (!refreshTokenVerify) {
        return next(new ErrorHandler(401, "Invalid refresh token", null));
    }
    const user = await User.findOne({ where: { id: refreshTokenVerify.id } });
    if (!user) {
        return next(new ErrorHandler(401, "User not found", null));
    }
    const authToken = await AuthToken.getAccessToken(user, refreshToken);
    return res.status(201).json({
        ok: true,
        message: "Access token generated",
        data: authToken,
    });
});

const loginController = {
    login,
    register,
    logout,
    refresh,
};

export default loginController;
