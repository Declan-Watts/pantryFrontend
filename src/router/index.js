import Vue from "vue";
import Router from "vue-router";
import AuthGuard from "./auth-guard";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/Login.vue")
    },
    {
      // beforeEnter: AuthGuard,
      path: "/",
      name: "dasboard",
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
    },
    {
      path: "/categories",
      name: "categories",
      component: () =>
        import(/* webpackChunkName: "categories" */ "../views/Categories.vue")
    },
    {
      // beforeEnter: AuthGuard,
      path: "/pantryItems",
      name: "pantryItems",
      component: () =>
        import(/* webpackChunkName: "pantryItems" */ "../views/PantryItems.vue")
    }
  ]
});
