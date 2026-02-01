"use strict";

const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalS3 } = require("../services/upload.service");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "Upload file success",
            metadata: await uploadImageFromUrl()
        }).send(res);
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new BadRequestError('No file uploaded');
        }

        new SuccessResponse({
            message: "Upload file thumb success",
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }

    uploadFileLocalS3 = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new BadRequestError('No file uploaded');
        }

        new SuccessResponse({
            message: "Upload file s3 success",
            metadata: await uploadImageFromLocalS3({
                file: file
            })
        }).send(res);
    }
}

module.exports = new UploadController();