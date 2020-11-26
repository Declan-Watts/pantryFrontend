import api from "@/api.js";

export default {
  state: {},
  mutations: {},
  actions: {
    async saveUser({ commit, rootState }, payload) {
      let returnData = {};
      await api
        .put("Users/MyProfile", payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          let user = rootState.auth.currentUser;
          user.details.email = payload.email;
          user.details.phoneNumber = payload.phoneNumber;
          commit("setCurrentUser", user);
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    }
  },
  getters: {}
};
