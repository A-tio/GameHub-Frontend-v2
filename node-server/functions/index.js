// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {  getAuth } from "firebase/auth";

initializeApp();



export const addUser = onRequest(async (req, res) => {

  const email = req.query.email;
  const password = req.query.pass;
  const auth = getAuth();
  const newUser = await getAuth().
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Successfully registered
      const user = userCredential.user;
      ////console.log("User registered:", user);
      // logInUser(email, password);
    })
    .catch((error) => {
      // Handle errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      // setError(errorMessage)
      console.error("Error registering user:", errorCode, errorMessage);
    });
  
    res.json({ result: `Registered user with ID: ${newUser.id} added.` });

})


export const addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});




export const makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
}); 