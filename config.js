import firebase from 'firebase';
require("@firebase/firestore");

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyBFExBO8t3ABe33WBaxCgOMsNAgN5mfvR0",
  authDomain: "harishbs-8a785.firebaseapp.com",
  databaseURL: "https://harishbs-8a785.firebaseio.com",
  projectId: "harishbs-8a785",
  storageBucket: "harishbs-8a785.appspot.com",
  messagingSenderId: "165005398045",
  appId: "1:165005398045:web:07b55a49c60894f57376f4"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();