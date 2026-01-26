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

module.exports = {
    uploadImageFromUrl
};