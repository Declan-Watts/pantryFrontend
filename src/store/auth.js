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
      if (typeof user != "undefined" && user.message == "Success") {
        api.defaults.headers.Authorization = `Bearer ${user.token}`;
        commit("setCurrentUser", user);
      } else {
        commit("setCurrentUser", {});
      }
      setTimeout(() => {
        commit("setFullLoader", false);
      }, 500);
    },
    async login({ commit, dispatch, state }, payload) {
      commit("setSiteFirstLoad", false);
      let returnData = {};
      await api
        .post("auth/login", payload)
        .then(response => {
          if (response.data.message == "Success") {
            commit("setCurrentUser", response.data);
            api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
          }
          returnData = response.data;
        })
        .catch(err => {
          returnData = {
            message: "error"
          };
        });
      return returnData;
    },
    async registerUser({ commit, dispatch }, payload) {
      let returnData;
      await api
        .post("auth/register", payload)
        .then(response => {
          if (response.data.message == "User Reigstration Successful") {
            dispatch("login", {
              username: payload.username,
              password: payload.password
            });
          } else {
            returnData = {
              message: "Failed",
              error: response.error
            };
          }
        })
        .catch(err => {
          returnData = {
            message: "Failed",
            error: err
          };
        });
      return returnData;
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
      localStorage.setItem("currentUser", JSON.stringify({}));
      localStorage.setItem("currentUserData", JSON.stringify({}));
      commit("setCurrentUser", {});
      commit("setCurrentUserData", {});
    },
    async passwordReset({ commit }, email) {
      api.post("users/passwordReset", { email: email });
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
