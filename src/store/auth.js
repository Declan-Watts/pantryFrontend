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
      window.localStorage.setItem("currentUser", JSON.stringify(user));
    },
    setCurrentUserData(state, user) {
      state.currentUserData = user;
      window.localStorage.setItem("currentUser", JSON.stringify(user));
    },
    setSiteFirstLoad(state, payload) {
      state.siteFirstLoad = payload;
    }
  },
  actions: {
    initAuth({ commit, dispatch }) {
      let user = JSON.parse(window.localStorage.currentUser);
      if (typeof user != "undefined" && user.message == "success") {
        commit("setCurrentUser", user);
      } else {
        commit("setCurrentUser", {});
      }
      setTimeout(() => {
        commit("setFullLoader", false);
      }, 500);
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
