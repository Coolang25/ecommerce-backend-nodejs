'use strict';

const cloudinary = require("../configs/cloudinary.config");
const crypto = require("crypto");
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const urlImagePublic = "https://d375rebufmcauw.cloudfront.net";

const randomImageName = () => crypto.randomBytes(16).toString('hex');

const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {


        const imageName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg',
        });

        const result = await s3.send(command);

        console.log('Upload successful:', result);

        const url = getSignedUrl({
            url: `${urlImagePublic}/${imageName}`,
            keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
            dateLessThan: new Date(Date.now() + 60 * 1000),
            privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
        });

        console.log('url:', url);

        return {
            url,
            result
        };
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}


const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://bookcover.yuewen.com/qdbimg/349573/1046840719/180';
        const folderName = 'product/shopId';
        const newFileName = 'testdemo';

        const result = await cloudinary.uploader.upload(
            urlImage,
            {
                folder: folderName,
                public_id: newFileName,
            }
        )

        console.log('Upload successful:', result);

        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8409',
}) => {
    try {
        const result = await cloudinary.uploader.upload(
            path,
            {
                folder: folderName,
                public_id: 'thumb',
            }
        )

        console.log('Upload successful:', result);

        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                format: "jpg",
            }),
        };
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalS3
};