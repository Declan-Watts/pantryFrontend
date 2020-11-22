import api from "@/api.js";

export default {
  state: {
    pantryItems: [],
    pantryItemsLoading: false
  },
  mutations: {
    setPantryItems(state, payload) {
      state.pantryItems = payload;
    },
    setPantryItemsLoading(state, loading) {
      state.pantryItemsLoading = loading;
    }
  },
  actions: {
    async loadPantryItems({ commit }) {
      commit("setPantryItemsLoading", true);
      let pantryItems = await api.get("PantryItems");
      commit("setPantryItems", pantryItems.data);
      commit("setPantryItemsLoading", true);
    },
    async newPantryItem({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .post("PantryItems", payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItems");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async savePantryItem({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .put(`PantryItems/${payload.pantryItemsID}`, payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItems");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async deletePantryItem({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .delete(`PantryItems/${payload}`)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItems");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    }
  },
  getters: {
    pantryItems(state) {
      return state.pantryItems;
    },
    pantryItemsLoading(state) {
      return state.pantryItemsLoading;
    }
  }
};
