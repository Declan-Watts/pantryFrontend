import Vue from "vue";
import Vuex from "vuex";
import auth from "./store/auth";
import settings from "./store/settings";
import pantryItems from "./store/PantryItems";
import categories from "./store/categories";
import pantryItemsStock from "./store/PantryItemsStock";
import user from "./store/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    settings,
    pantryItems,
    categories,
    pantryItemsStock,
    user
  }
});
