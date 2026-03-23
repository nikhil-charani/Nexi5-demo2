const admin=require("firebase-admin")
const path = require('path')
const fs = require('fs')

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Attempt to load from an environment variable string (JSON format)
    try {
        const serviceAccountConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccountConfig);
    } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it's valid JSON.", error);
    }
}

// Fallback to local files if the env var was not provided or failed to load
if (!credential) {
    const serviceAccountFile = process.env.NODE_ENV === 'production' 
        ? './ServiceAccountKey-prod.json' 
        : './ServiceAccountKey-dev.json';
    const serviceAccountPath = path.resolve(__dirname, serviceAccountFile);

    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`Service account key not found at ${serviceAccountPath}`);
    } else {
        credential = admin.credential.cert(serviceAccountPath);
    }
}

admin.initializeApp({
    credential: credential
});

const db = admin.firestore();
const auth=admin.auth()
module.exports={admin,db,auth};