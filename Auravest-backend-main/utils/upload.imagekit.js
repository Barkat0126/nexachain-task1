const ImageKit = require("imagekit");
const { v4: uuid } = require("uuid");

let imagekit;
try {
    if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    } else {
        console.warn("ImageKit credentials missing. Uploads will fail.");
    }
} catch (error) {
    console.warn("Failed to initialize ImageKit:", error.message);
}

module.exports.uploadToImageKit = async (file, folder) => {
    if (!imagekit) {
        console.error("ImageKit not initialized");
        return null;
    }
    try {
        if (!file) return null;

        const baseFolder = "YOMOKO";
        const cleanedSubFolder = folder ? folder.trim().replace(/^\/+|\/+$/g, "") : "";
        const fullFolderPath = cleanedSubFolder ? `${baseFolder}/${cleanedSubFolder}/` : baseFolder;

        const fileInput = Buffer.isBuffer(file)
            ? file.toString("base64")
            : typeof file === "string"
              ? file
              : null;

        if (!fileInput) throw new Error("Invalid file input provided to ImageKit");

        const result = await imagekit.upload({
            file: fileInput,
            fileName: uuid(),
            useUniqueFileName:true,
            folder: fullFolderPath,
        });

        return result.url;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw error;
    }
};

// const {hash} = require("bcryptjs");

// hash('Test@123',10).then(e=>{
//     console.log(e)
// })
