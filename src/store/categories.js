import api from "@/api.js";

export default {
  state: {
    categories: [],
    categoriesLoading: false
  },
  mutations: {
    setCategories(state, payload) {
      state.categories = payload;
    },
    setCategoriesLoading(state, loading) {
      state.categoriesLoading = loading;
    }
  },
  actions: {
    async loadCategories({ commit }) {
      commit("setCategoriesLoading", true);
      let categories = await api.get("Categories");
      commit("setCategories", categories.data);
      commit("setCategoriesLoading", true);
    },
    async newCategory({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .post("Categories", payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadCategories");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async saveCategory({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .put(`Categories/${payload.categoriesID}`, payload)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadCategories");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    },
    async deleteCategory({ commit, dispatch }, payload) {
      let returnData = {};
      await api
        .delete(`Categories/${payload}`)
        .then(response => {
          returnData = response;
          returnData["Result"] = "Success";
          dispatch("loadCategories");
        })
        .catch(err => {
          returnData = err;
          returnData["Result"] = "Failed";
        });
      return returnData;
    }
  },
  getters: {
    categories(state) {
      return state.categories;
    },
    categoriesLoading(state) {
      return state.categoriesLoading;
    }
  }
};
