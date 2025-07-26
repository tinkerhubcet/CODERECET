import { asyncErrorHandler, ErrorHandler } from "#middlewares";
import { User, File } from "#models";
import { Sequelize } from "#utils";

const uploadFile = asyncErrorHandler(async (req, res, next) => {
    const bucketName = "vitalis-arkway";
    const file = req.file;
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
        return next(new ErrorHandler(403, "User not found", null));
    }
    if (!file) {
        return next(new ErrorHandler(400, "File not provided", null));
    }
    let { originalname } = file;

    const newName = `${uuid()}.${getFileExtension(originalname)}`;

    const uploadParams = {
        Bucket: bucketName,
        Key: newName,
        Body: file.buffer,
    };
    let data;

    s3.upload(uploadParams, async function (err, fileData) {
        if (err) {
            return next(new ErrorHandler(500, "File upload failed", err));
        }
        if (data) {
            await Sequelize.transaction(async (t) => {
                const options = {
                    createdBy,
                    transaction: t,
                };
                const newFile = await File.create(
                    { name: newName, userId: req.user.id },
                    options,
                );
                await newFile.save();
            });
            data = fileData;
        }
    });
    res.status(201).json({
        ok: true,
        message: "Registered successfully",
        data,
    });
});

export default { uploadFile };
