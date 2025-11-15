import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import admin from "firebase-admin"
import { createRequire } from "module";
import Identicon from 'identicon.js';

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccount.json");

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const auth = admin.auth();
const db = admin.firestore();


app.use(cors());
app.use(express.json());
app.use(morgan(':date[iso] :method :url :status :response-time ms'));

app.get('/', (req, res) => {
  res.send('Hello, ES Modules Express with hot reload!');
});
app.post("/signup", async (req, res) => {
  const { email, password, username, phone } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password, // Firebase will hash automatically
    });
    const profile = new Identicon(userRecord.uid, 420).toString();
    // 2️⃣ Store additional user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      username,
      profile: profile,
      isActivated: false,
      phone: phone || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

