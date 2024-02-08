const express = require("express");
const fs = require("fs");
const {google} = require("googleapis");
const router = express.Router();
const {downloadAndUpload, downloadAndUploadStatus} = require("./downloadProcessor/googleFileHelper")
const auth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)
try {
    const creds = fs.readFileSync("creds.json");
    auth2Client.setCredentials(JSON.parse(creds));
} catch (er) {
    console.log(er)
}
router.get("/auth", (req,res)=>{
    const url = auth2Client.generateAuthUrl({
        accessType: "offline",
        scope: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.appdata',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/drive.photos.readonly',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.appfolder'
          ]
    });
    res.redirect(url)
})

router.get("/redirect", async(req,res)=>{
    const {code} = req.query;
    const {tokens} = await auth2Client.getToken(code);
    auth2Client.setCredentials(tokens);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send("succes")  
})

router.get("/upload", async(req,res)=>{
    const drive  = google.drive({version: "v3", auth: auth2Client});
    const text = "My First Upload through API"
    await drive.files.create({
        requestBody:{
            name: "text.text",
            mimeType: "text/plain"
        },
        media:{
            mimeType: "text/plain",
            body: text
        }
    })
    res.send("Saved!")
})

router.get("/download", async (req, res) => { 
    const url = req.query.url;
    const match = url.match(/\/file\/d\/([^/]+)/);
    const fileId = match && match[1];
    try {
      if (fileId) {
        const filePath = await downloadAndUpload(fileId, auth2Client);
        
        res.send("File downloaded successfully in path:" + filePath);
      } else {
        res.status(400).json({ error: "File ID not found in the URL" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

  router.get("/status", (req,res)=>{
    const getStatus =  downloadAndUploadStatus()
    res.json(getStatus)
  })

module.exports = router