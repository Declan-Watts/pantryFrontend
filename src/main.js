import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueSweetalert2 from "vue-sweetalert2";
// import VueQrcodeReader from "vue-qrcode-reader";
import moment from "moment";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import Croppa from "vue-croppa";
import "vue-croppa/dist/vue-croppa.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
import VueStripeCheckout from "vue-stripe-checkout";
if (!window.localStorage.hasOwnProperty("currentUser")) {
  window.localStorage.setItem("currentUser", JSON.stringify({}));
}

Vue.use(Vuetify);

Vue.directive("clickable", {
  inserted: function(el) {
    el.style.cursor = "pointer";
  }
});

Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

Vue.use(VueSweetalert2);
// Vue.use(VueQrcodeReader);
Vue.use(Croppa);

Vue.use(moment);

new Vue({
  vuetify,
  router,
  store,
  head: {
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      }
    ]
  },
  beforeCreate() {
    this.$store.dispatch("setFullLoaderState", true);
    this.$store.dispatch("initAuth");
  },
  render: h => h(App)
}).$mount("#app");
