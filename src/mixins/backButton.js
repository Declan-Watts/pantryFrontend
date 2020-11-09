export default function (props) {
  let initialValues = {};

  return {
    created () {
      for (let prop of props) {
        initialValues[prop] = this[prop];
      }

      const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
        for (let prop of props) {
          if (prop === 'VXcartOpen' && this.$store.getters.cartOpen === true) {
            this.$store.dispatch("closeCart");
            next(false);
            return;
          } else {
            if (this[prop] !== initialValues[prop]) {
              this[prop] = initialValues[prop];
              next(false);
              return;
            }
          }
        }

        next();
      });

      this.$once('hook:destroyed', () => {
        unregisterRouterGuard()
      });
    },
  }
}