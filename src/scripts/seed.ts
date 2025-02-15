import { db } from "../lib/firebase"
import { collection, addDoc, setDoc, doc } from "firebase/firestore"

async function seed() {
  // Create a test user
  const userRef = await addDoc(collection(db, "users"), {
    name: "Test User",
    email: "test@example.com",
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Create a wallet for the user
  await setDoc(doc(db, "wallets", userRef.id), {
    balance: 100.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Create some test matches
  await addDoc(collection(db, "matches"), {
    type: "competitive",
    result: "win",
    userId: userRef.id,
    createdAt: new Date(),
  })

  await addDoc(collection(db, "matches"), {
    type: "machine",
    result: "loss",
    userId: userRef.id,
    createdAt: new Date(),
  })

  console.log("Seed data inserted successfully")
}

seed().catch(console.error)

