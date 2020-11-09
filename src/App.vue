<template>
  <v-app id="default">
    <!-- style="background-color:#edffea"-->
    <v-content>
      <!-- <v-fade-transition>
        <div v-if="fullLoading" class="loaderOverlay">
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </v-fade-transition> -->
      <app-bar v-if="$route.path != '/login'" />
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  import { auth } from "@/firebase.js";
  import { mapGetters } from "vuex";
  import AppBar from "@/components/AppBar";

  export default {
    components: {
      AppBar,
    },
    computed: {
      ...mapGetters(["currentUser", "currentUserData"]),
    },
    data: () => ({
      bottomBarVisible: true,
      clipped: true,
      drawerRoutes: {},
    }),
    watch: {
      // currentUserData: function (oldData, newData) {
      //   if (
      //     this.currentUserData.Result == "Success" &&
      //     this.$route.path === "/"
      //   ) {
      //     this.$router.push("/dashboard");
      //   } else if (
      //     this.currentUserData.Result != "Success" &&
      //     this.$route.path != "/"
      //   ) {
      //     this.$router.push("/");
      //   }
      // },
    },
    mounted() {
      // if (this.currentUserData.Result == "Success" && this.$route.path === "/") {
      //   this.$router.push("/dashboard");
      // } else if (
      //   this.currentUserData.Result != "Success" &&
      //   this.$route.path != "/"
      // ) {
      //   this.$router.push("/");
      // }
      // this.bottomNav = this.$route.name;
    },
  };
</script>

<style>
  html {
    overflow-y: auto;
  }

  .v-card__text {
    padding-bottom: 0px !important;
    padding-top: 14px !important;
  }

  ​ .v-bottom-navigation .v-btn {
    height: inherit !important;
  }

  .swal2-container {
    font-family: Helvetica;
  }

  .editDialogButton {
    width: 20pt !important;
    height: 20pt !important;
  }
  .editDialogIcon {
    font-size: 15pt !important;
  }
  .helperToolTip {
    max-width: 600px;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #38b6ff;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>

<style scoped>
  .loaderOverlay {
    z-index: 9999;
    background: #ffffff;
    width: 100vw;
    height: 100vh;
    position: fixed;
  }
  .lds-ripple {
    top: calc(50vh - 40px);
    left: calc(50vw - 40px);
    display: inline-block;
    position: fixed;
    width: 80px;
    height: 80px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #38b6ff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }

  @keyframes lds-ripple {
    0% {
      top: 36px;
      left: 36px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
</style>
