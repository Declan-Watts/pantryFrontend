import Vue from "vue";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import "firebase/analytics";

var config = {
  apiKey: "AIzaSyCRbkL3M4d-9HF1DXT7uK-V0PzPFqTDG8E",
  authDomain: "derekprinceapp.firebaseapp.com",
  databaseURL: "https://derekprinceapp.firebaseio.com",
  projectId: "derekprinceapp",
  storageBucket: "derekprinceapp.appspot.com",
  messagingSenderId: "959338433877",
  appId: "1:959338433877:web:80f3bb366227ffadd973dc",
  measurementId: "G-RB7LNG87DN"
};

// let host = window.location.host;
// if (
//   host == "localhost:8080" ||
//   host == "localhost:8081" ||
//   host == "localhost:8082" ||
//   host == "192.168.178.21:8080" ||
//   host == "192.168.178.21:8081" ||
//   host == "192.168.178.21:8082" ||
//   host == "10.0.0.9:8080" ||
//   host == "DomainOfDev" ||
//   host.substring(0, 4) == "dev."
// ) {
//   var config = {};
// }

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

let cloneFunction = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

firebase.analytics();
Vue.prototype.analytics = firebase.analytics();
export const clone = cloneFunction;
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const dataB = firebase.database();
export const DB = firebase.firestore();
export const files = firebase.storage().ref();
export const driverRef = DB.collection("Drivers");
export default firebase;
