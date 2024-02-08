const { google } = require("googleapis");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const os = require("os");
const { authenticate } = require("@google-cloud/local-auth");
const uuid = require("uuid");
const EventEmitter = require("events");
const event = new EventEmitter();
const progress = {
    upload: {
        status: "",
        chunks: 0
    },
    download: {
        status: "",
        chunks: 0
    }
}
event.on("upload", ({chunks, status})=>{
    if (chunks){
        progress.upload.chunks = chunks
    }
    if (status){
        progress.upload.status = status 
    }
})
event.on("download", ({chunks, status})=>{
    if (chunks){
        progress.download.chunks = chunks
    }
    if (status){
        progress.download.status = status 
    }
})

async function downloadAndUpload(fileId, auth2Client) {
    const drive = google.drive({ version: "v3", auth: auth2Client });
    const downloadStream = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    const filePath = path.join(__dirname, uuid.v4());

    const uploadPromises = [];

    let uploadProgress = 0;
    let downloadProgress = 0;
    downloadStream.data.on("data", async (chunk) => {
        uploadProgress += chunk.length;
        downloadProgress += chunk.length;
        event.emit("download", {chunks: downloadProgress, status: "In Progress"})
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = fs.createWriteStream(filePath, { flags: "a" });
            event.emit("upload", {chunks: uploadProgress, status: "In Progress"})
            uploadStream.write(chunk);
            uploadStream.on("finish", () => {
                console.log(`Chunk uploaded: ${uploadProgress} bytes`);
                resolve();
            });
            uploadStream.on("error", (error) => {
                console.error("Error uploading chunk:", error);
                event.emit("download", {status: "Error"})
                reject(error);
            });
        });

        uploadPromises.push(uploadPromise);
    });

    downloadStream.data.on("end", async () => {
        console.log("Download completed.");
        event.emit("download", {status: "Complete"})
        const fileMetadata = {
            name: 'DownloadedFile.mp4', 
        };
        const media = {
            mimeType: 'video/mp4', 
            body: fs.createReadStream(filePath),
        };
        try {
            const uploadedFile = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });
            event.emit("upload", {status: "Complete"})
            console.log('File uploaded:', uploadedFile.data);
        } catch (error) {
            event.emit("upload", {status: "Error"})
            console.error('Error uploading file to Google Drive:', error);
            throw error;
        }
    });

    downloadStream.data.on("error", (error) => {
        event.emit("download", {status: "Error"})
        console.error("Error downloading file:", error);
        throw error;
    });
    return filePath
}

function downloadAndUploadStatus(){
    return progress
}

module.exports = {downloadAndUpload, downloadAndUploadStatus}
