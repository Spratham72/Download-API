
# Node.js File Download and Upload to Google Drive

This Node.js application allows you to download a file from Google Drive in chunks and upload it simultaneously to Google Drive.

## Setup

### Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node.js package manager)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Spratham72/Download-API.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repo
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

### Google Drive Account Setup

To use this application, you'll need a Google account and access to the Google Drive API. Follow these steps to set it up:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the Google Drive API for your project:
   - Go to the "APIs & Services" > "Library" page.
   - Search for "Google Drive API" and enable it.
4. Create OAuth 2.0 credentials:
   - Go to the "APIs & Services" > "Credentials" page.
   - Click on "Create credentials" and select "OAuth client ID".
   - Choose "Web application" as the application type.
   - Add `http://localhost:3000/google/redirect` as an authorized redirect URI (you can change this later).
   - Click on "Create" to generate the client ID and client secret.
5. Download the credentials JSON file.


### Configuration

1. Rename the downloaded credentials JSON file to `credentials.json` and place it in the root of your project directory.

2. Update the `.env` file with your credentials:

   ```
   FILE_ID = <your-file-id>
   CLIENT_ID = <your-client-id>
   CLIENT_SECRET= <your-client-secret>
   PROJECT_ID = <your-project-id>
   REDIRECT_URI = http://localhost:3000/google/redirect
   PORT = 3000
   ```

## Usage

To run the application, execute the following command in your terminal:

```bash
npm start
```
- To Login in app hit http://localhost:3000/google/auth; Make sure to add gmail in test users in your console
- To download the video hit http://localhost:3000/google/download?url=<replacewithvideosharingurl>
- To know the status of download and upload hit http://localhost:3000/google/status

The application will download the video from Google Drive and upload it to Google Drive.

