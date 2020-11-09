import api from "@/api.js";

export default {
  state: {
    siteData: {},
    fullLoading: false,
    navigationDrawer: true,
    aGGridActionMenu: false,
    selectedRowData: {}
  },
  mutations: {
    setSiteData(state, payload) {
      state.siteData = payload;
    },
    setFullLoader(state, loading) {
      state.fullLoading = loading;
    },
    setNavigationDrawer(state, drawer) {
      state.navigationDrawer = drawer;
    },
    setAGGridActionMenu(state, payload) {
      state.aGGridActionMenu = payload;
    },
    setSelectedRowData(state, rowData) {
      state.selectedRowData = rowData;
    }
  },
  actions: {
    async loadSiteData({ commit }) {
      let siteData = await api.get("PantryItems");
      console.log(siteData);
      commit("setSiteData", siteData.data);
    },
    async setNavigationDrawerState({ commit }, payload) {
      commit("setNavigationDrawer", payload);
    },
    async setAGGridActionMenuState({ commit, state }, payload) {
      commit("setAGGridActionMenu", !state.aGGridActionMenu);
      commit("setSelectedRowData", payload);
    },
    async setSelectedRowData({ commit }, payload) {
      commit("setSelectedRowData", payload);
    }
  },
  getters: {
    siteData(state) {
      return state.siteData;
    },
    fullLoader(state) {
      return state.fullLoader;
    },
    navigationDrawer(state) {
      return state.navigationDrawer;
    },
    aGGridActionMenu(state) {
      return state.aGGridActionMenu;
    },
    selectedRowData(state) {
      return state.selectedRowData;
    }
  }
};
