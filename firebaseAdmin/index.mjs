import admin from "firebase-admin";

var serviceAccount = {
  "type": "service_account",
  "project_id": "social-media-app-storage-877b9",
  "private_key_id": "9f0e5449656391bfe1dacb4ef0119d8b2632c654",
  "private_key": process.env.firebaseAdminKey,
  "client_email": "firebase-adminsdk-tnazq@social-media-app-storage-877b9.iam.gserviceaccount.com",
  "client_id": "114089154281606083566",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tnazq%40social-media-app-storage-877b9.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-app-storage-877b9.firebase.com"
});
const bucket = admin.storage().bucket("gs://social-media-app-storage-877b9.appspot.com")

export default bucket;