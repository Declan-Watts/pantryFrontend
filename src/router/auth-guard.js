import { state } from "../store";
import { auth } from "@/firebase.js";

export default (to, from, next) => {
  let user = JSON.parse(window.localStorage.currentUser);
  let toPage = {};
  if (typeof window.localStorage.toPage != "undefined") {
    toPage = JSON.parse(window.localStorage.toPage);
  }
  console.log(user);
  if (typeof user != "undefined" && user.message == "success") {
    if (typeof toPage.fullPath != "undefined" && toPage.fullPath != "/login") {
      localStorage.setItem("toPage", JSON.stringify({}));
      next(toPage.fullPath);
    } else if (to.fullPath == "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    localStorage.setItem("toPage", JSON.stringify(to));
    next("/login");
  }
  document.querySelector("html").scrollTop = 0;
};
