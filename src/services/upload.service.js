'use strict';

const cloudinary = require("../configs/cloudinary.config");

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
    uploadImageFromLocal
};