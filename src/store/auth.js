import api from "@/api.js";
import { auth, GoogleProvider, adminAuth } from "@/firebase.js";
import router from "../router";

export default {
  state: {
    currentUser: null,
    currentUserData: {},
    siteFirstLoad: true
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setCurrentUserData(state, user) {
      state.currentUserData = user;
    },
    setSiteFirstLoad(state, payload) {
      state.siteFirstLoad = payload;
    }
  },
  actions: {
    initAuth({ commit, dispatch }) {
      auth.onAuthStateChanged(user => {
        if (user !== null) {
          api.defaults.headers.Authorization = `Bearer ${user._lat}`;
          localStorage.setItem("currentUser", JSON.stringify(user));
          commit("setCurrentUser", user);
          dispatch("loadCurrentUserData");
        } else {
          // dispatch("setFullLoaderState", false);
        }
      });
    },
    login({ commit, dispatch, state }, payload) {
      commit("setSiteFirstLoad", false);
      return auth
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(result => {
          localStorage.setItem("currentUser", JSON.stringify(result.user));
          commit("setCurrentUser", result.user);
        })
        .catch(err => {
          return err;
        });
    },
    loginWithGoogle({ commit, dispatch, state }) {
      commit("setSiteFirstLoad", false);
      return auth.signInWithPopup(GoogleProvider).then(async result => {
        commit("setCurrentUser", result.user);
        // dispatch("loadCurrentUserDataGoogleSignIn", result.user);
        // router.push("dashboard");
      });
    },
    registerUser({ commit, dispatch }, payload) {
      return auth
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(result => {
          commit("setCurrentUser", result.user);
          delete payload.password;
          payload.firebase_id = result.user.uid;
          payload.business_name = payload.businessName;
          if (payload.isBusiness) {
            payload.role = ["business"];
          }
          api.post("user", payload).then(data => {
            dispatch("loadCurrentUserData", result.user.uid);
          });
        })
        .catch(err => {
          return err;
        });
    },
    async loadCurrentUserData({ commit, rootState, dispatch }) {
      commit("setCurrentUserData", { Result: "Loading" });
      let userData = await api.get("user/CurrentUserData", {
        params: { appID: rootState.settings.appID }
      });
      localStorage.setItem("currentUserData", JSON.stringify(userData.data));
      commit("setCurrentUserData", userData.data);
      if (userData.data.Result == "Denied") {
        router.replace("/");
        dispatch("logout");
      }
      setTimeout(function() {
        // dispatch("setFullLoaderState", false);
      }, 500);
    },
    // async loadCurrentUserDataGoogleSignIn({ commit, rootState }, user) {
    //   let userData = await api.get("user/CurrentUserData", {
    //     params: { appID: rootState.settings.appID },
    //   });
    //   localStorage.setItem("currentUserData", JSON.stringify(userData.data));
    //   commit("setCurrentUserData", userData.data);
    //   if (userData.data.Result == "Denied") {
    //     router.replace("/");
    //   }
    //   setTimeout(function() {
    //     dispatch("setFullLoaderState", false);
    //   }, 500);
    //   // let userData = await api.get("user/CurrentUserDataGoogle", user);
    //   // commit("setCurrentUserData", userData.data);
    //   // if (userData.data == "Denied") {
    //   //   router.push("/ownerships");
    //   // } else if (router.currentRoute.name === "login") {
    //   //   // router.push("/dashboard");
    //   // }
    // },
    logout({ commit }) {
      auth.signOut().then(() => {
        localStorage.setItem("currentUser", JSON.stringify({}));
        localStorage.setItem("currentUserData", JSON.stringify({}));
        commit("setCurrentUser", {});
        commit("setCurrentUserData", {});
      });
    },
    async passwordReset({ commit }, email) {
      api.post("users/passwordReset", { email: email });
    },
    async linkAccountToGoogle({ commit }) {
      let returnData;
      await auth.currentUser
        .linkWithPopup(GoogleProvider)
        .then(function(result) {
          returnData = "Success";
        })
        .catch(function(error) {
          console.log(error);
          returnData = error;
        });
      return returnData;
    }
  },
  getters: {
    currentUser(state) {
      return state.currentUser;
    },
    currentUserData(state) {
      return state.currentUserData;
    },
    siteFirstLoad(state) {
      return state.siteFirstLoad;
    }
  }
};
