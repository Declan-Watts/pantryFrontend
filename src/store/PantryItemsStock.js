import api from "@/api.js";

export default {
  state: {
    pantryItemsStock: [],
    pantryItemsStockLoading: false
  },
  mutations: {
    setPantryItemsStock(state, payload) {
      state.pantryItemsStock = payload;
    },
    setPantryItemsStockLoading(state, loading) {
      state.pantryItemsStockLoading = loading;
    }
  },
  actions: {
    async loadPantryItemsStock({ commit }) {
      commit("setPantryItemsStockLoading", true);
      let pantryItemsStock = await api.get("PantryItems_Stock");
      console.log(pantryItemsStock);
      commit("setPantryItemsStock", pantryItemsStock.data);
      commit("setPantryItemsStockLoading", true);
    },
    async newPantryItemsStock({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .post("PantryItems_Stock", payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItemsStock");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async savePantryItemsStock({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .put(`PantryItems_Stock/${payload.stockID}`, payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItemsStock");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async deletePantryItemsStock({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .delete(`PantryItems_Stock/${payload}`)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadPantryItemsStock");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    }
  },
  getters: {
    pantryItemsStock(state) {
      return state.pantryItemsStock;
    },
    pantryItemsStockLoading(state) {
      return state.pantryItemsStockLoading;
    }
  }
};
