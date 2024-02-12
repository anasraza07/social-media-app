import admin from "firebase-admin";

var serviceAccount = {
  "type": "service_account",
  "project_id": "social-media-app-storage-877b9",
  "private_key_id": "9f0e5449656391bfe1dacb4ef0119d8b2632c654",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvm+nDXF+9frQr\nRZT7+Ce9tZnZmrIitMbsnIreRfK0dWnFb2GFszOMBM01q4XloGuUUjh61wjRLhGM\nY9q5lGhtAj0Ajx7usdb4/5yTjEbhPlCxFEgXL07AIvBj4I85ehahnxu6uTdfYLob\nfEO86VkmzbCdO0uip3SK0+bDLGLz6NKbzLguiTJxsYDnG6DzDtzYpUBJK4NTnggF\nIlE6GsbtGJTvvC4xY8QatSXzrKtoygNNEqyh0i8TW7/RvA7UyktdgVeE2R0CFZaW\nHgrTuSRziu2YPbdThlJN53A30CKXBxrfjvXjT07AgONOrbTIZJ3QoXdlsy2QwVxV\nHIjlOOX7AgMBAAECggEAQ1N9Tf8OXbJEFQr6UZgUdHE5aOocPZ4dXf2uaAVdRb52\nLNHFC+NmcdotatQ145GbbSQQr1fd84S8CZ0G8Htrhc+D38D/VPgtuQ0W1KLFUfn4\nKcviz7C9eoBqtYAUqS6bmp9LnE0CY7jL4VnFBppYKb5WZhGjr9qPneIb6NwNnAEW\nZ6cjR0pQ9Ps99yM3OnvLvQukJMjEpf0SqMqeX0eBQVc662DiXsWheBbFQ1DkdKcz\nVXP3iKqUkkL+RrzWlVbl3K2tdtJbHwJ0ustfHPcLmlotMiyde0VQE2777WkkKjTa\ncDlfA/Jy4sANMGlo1SwvvjkaEyRlw0CsCbkhAIMQUQKBgQDepbpQyL097D3Lo9UR\nufBLqfeaYb4AkaUmq4wMftrMcJRruYktrrviHincEtQJ+pJxSDWYtcKNvCUAikk9\ncrXdjbkDBKO+PdC6jAlPEAIXEehgrGrQLK5jazepE0TLWYkgZQkBBSLYPdvVmAQ6\nNaZBzj7hGx2Kt1pADBTWOWqJJQKBgQDJ6lGgCsu6fnCuvPopR0/bh9Cfr0I2/LkI\nFqzgHACpJugB0PJJR/1Sg0a+9yMsTnPOSdPWO8vXvU79nbG6wzQK0rOAxo2AqRxA\nDw1RKt0CZ3cR5l1ZjRF8PDaz12fELxMx353yxqSzbR3kPbI/rUjqbA2cV0ZWvluQ\nVHhgg3VYnwKBgCaiQ045Rv0zvRVU/GfzB8tZVumnBD09CJdJNSgF6xmGf3qh2zfe\nFiQKb+EMM1b37+lQSlyRTY0ilJkfZc4P1Zb4PJ5Vc8RTHaEBI6xgbrxqExSTVoWA\n+1GtDR99hHZ0tuK0JXfT2FQFh9vsYO9o18ybaTXOarXjUvnCHut9UwsxAoGAYdNt\nCKUyX4CzB3X3ndg3EJ2UrkkzQ4DeBNU3nLz0dP+smHSrbmW6jiecNxl1qRm5cdDD\nGaCO+k913dpxKZM5u6Sp41JPbG6CiWbBhPnHakrGnZ2GzMRUHGTv++H5HEvSeO9m\njyE+2s+bE+HwYnmKQklnrr96DLzdj+fdCqWmTPECgYEAtK6LP2nGxqdPOnARGmfQ\nq3Ub24qL6TUwwjIB0yAaMd7olhLnHUJYRr61yD6+xcXh6BK1CwS9PQctpOYq2sZN\nVg5oe88aq/9KIEWFN89h7vVWSW6qHhRar4DFubg6XAjedyhCTh2AtaclmmVxNQNr\nGsHLjegL6v0XjyRLD9WXt/o=\n-----END PRIVATE KEY-----\n",
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