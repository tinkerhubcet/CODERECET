import path from "path";
import { v4 as uuid } from "uuid";

import { User, File } from "#models";
import { Sequelize, S3 } from "#utils";
import { asyncErrorHandler, ErrorHandler } from "#middlewares";

const uploadFile = asyncErrorHandler(async (req, res, next) => {
    const bucketName = "vitalis-arkway/Prescription";
    const file = req.file;
    const s3 = S3();

    const getFileExtension = (filename) => {
        return path.extname(filename).split(".")[1];
    };

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
        return next(new ErrorHandler(403, "User not found", null));
    }
    if (!file) {
        return next(new ErrorHandler(400, "File not provided", null));
    }
    let { originalname } = file;

    const newName = `${uuid()}.${getFileExtension(originalname)}`;
    file.originalname = newName;

    const uploadParams = {
        Bucket: bucketName,
        Key: newName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    let data;

    await Sequelize.transaction(async (t) => {
        const fileData = await s3.upload(uploadParams).promise();
        const options = {
            transaction: t,
        };
        const newFile = await File.create(
            {
                name: newName,
                url: fileData.Location,
                key: fileData.key,
                userId: req.user.id,
                bucket: bucketName,
            },
            options,
        );
        data = fileData;
        await newFile.save();
    });
    res.status(201).json({
        ok: true,
        message: "File uploaded successfully",
        data,
    });
});

const getFile = asyncErrorHandler(async (req, res, next) => {
    return res.status(200).json({ message: "hello world" });
});

export default { uploadFile, getFile };
