import { asyncErrorHandler, ErrorHandler } from "#middlewares";
import { User } from "#models";
import { Sequelize } from "#utils";

const getUser = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOne({
        where: { id },
    });
    if (!user) {
        return next(new ErrorHandler(404, "User not found", null));
    }
    res.status(200).json({
        ok: true,
        message: "User fetched successfully",
        data: user,
    });
});

const getUsers = asyncErrorHandler(async (req, res, next) => {
    const { limit, offset } = req.body;
    const users = await User.findAll({
        limit: limit,
        offset: offset,
    });
    if (!users) {
        return next(new ErrorHandler(404, "Users not found", null));
    }
    res.status(200).json({
        ok: true,
        message: "Users fetched successfully",
        data: users,
    });
});

const getUsersWithoutCandidates = asyncErrorHandler(async (req, res, next) => {
    const { limit, offset } = req.body;
    const users = await User.findAll({
        limit: limit,
        offset: offset,
    });
    if (!users) {
        return next(new ErrorHandler(404, "Users not found", null));
    }
    res.status(200).json({
        ok: true,
        message: "Users fetched successfully",
        data: users,
    });
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;
    const updatedBy = await User.findOne({ where: { id: req.user.id } });
    if (!updatedBy) {
        return next(
            new ErrorHandler(401, "Guest not authorized to update user", null),
        );
    }
    const user = await User.findOne({
        where: { id },
    });
    if (!user) {
        return next(new ErrorHandler(404, "User not found", null));
    }
    await Sequelize.transaction(async (t) => {
        if (email) {
            await user.update({ email }, { transaction: t });
        }
        await user.save({ transaction: t });
    });
    res.status(201).json({
        ok: true,
        message: "User updated successfully",
        data: null,
    });
});

const removeUser = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
        return next(new ErrorHandler(404, "User not found", null));
    }
    await user.destroy();
    return res.json({
        ok: true,
        message: "User removed successfully",
        data: null,
    });
});

const userController = {
    getUser,
    getUsers,
    updateUser,
    removeUser,
    getUsersWithoutCandidates,
};

export default userController;
