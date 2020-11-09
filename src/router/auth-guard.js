import { state } from "../store";
import { auth } from "@/firebase.js";

export default (to, from, next) => {
  let user = JSON.parse(window.localStorage.currentUser);
  let userData = JSON.parse(window.localStorage.currentUserData);
  let toPage = {};
  if (typeof window.localStorage.toPage != "undefined") {
    toPage = JSON.parse(window.localStorage.toPage);
  }
  if (user && userData.Result == "Success") {
    if (typeof toPage.fullPath != "undefined" && toPage.fullPath != "/") {
      localStorage.setItem("toPage", JSON.stringify({}));
      next(toPage.fullPath);
    } else if (to.fullPath == "/") {
      next("/dashboard");
    } else {
      next();
    }
  } else {
    localStorage.setItem("toPage", JSON.stringify(to));
    next("/");
  }
  document.querySelector("html").scrollTop = 0;
};
