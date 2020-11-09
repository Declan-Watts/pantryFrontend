import Vue from "vue";
import Vuetify, { VTextField } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      dark: {
        primary: "#38b6ff",
        secondary: "#216353",
        anchor: "#7a4d1d",
        success: "#00C853",
        background: "#edffea",
      },
      light: {
        primary: "#38b6ff",
        secondary: "#216353",
        anchor: "#7a4d1d",
        success: "#00C853",
        background: "#edffea",
      },
    },
  },
  components: {
    VTextField,
  },
});
