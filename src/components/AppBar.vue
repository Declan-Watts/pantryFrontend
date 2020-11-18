<template>
  <div>
    <v-navigation-drawer
      :expand-on-hover="miniNav && $vuetify.breakpoint.lgAndUp"
      :mini-variant="miniNav && $vuetify.breakpoint.lgAndUp"
      color="white"
      app
      overflow
      v-model="drawer"
      :clipped="clipped"
      v-if="currentUserData"
    >
      <v-list dense>
        <!-- <v-list-item :to="'/'">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->
        <v-list-item :to="'/'">
          <v-list-item-action>
            <v-icon>mdi-grid</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="'/categories'">
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="'/pantryItems'">
          <v-list-item-action>
            <v-icon>mdi-food-apple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Pantry Food List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="'/pantryItemsStock'">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Pantry Stock</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-if="$vuetify.breakpoint.lgAndUp" v-slot:append>
        <div class="pl-3 mb-4">
          <v-switch
            v-model="miniNav"
            @change="updateView"
            label="Mini Nav"
          ></v-switch>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark :clipped-left="true">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        @click="
          () => {
            if ($route.path !== '/') {
              $router.push('/');
            }
          }
        "
        v-clickable
        >{{ siteData.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
        v-if="currentUser"
        v-model="userMenu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="transparent"
            text
            dark
            v-bind="attrs"
            v-on="on"
            class="pa-0"
          >
            <!-- <avatar
              :size="35"
              color="white"
              :username="
                currentUser.displayName == null
                  ? currentUser.email
                  : currentUser.displayName
              "
            ></avatar> -->
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <!-- <avatar
                  :size="35"
                  color="white"
                  :username="
                    currentUser.displayName == null
                      ? currentUser.email
                      : currentUser.displayName
                  "
                ></avatar> -->
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  currentUser.displayName
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  currentUser.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-btn @click="resetPassword" color="red" block
                >Reset Password</v-btn
              >
            </v-list-item>
            <v-list-item>
              <v-btn
                block
                v-if="currentUser"
                @click="$store.dispatch('logout')"
              >
                <v-icon left>mdi-lock-open</v-icon> Logout
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import Avatar from "vue-avatar";

  export default {
    computed: {
      ...mapGetters([
        "siteData",
        "currentUser",
        "currentUserData",
        "navigationDrawer",
      ]),
    },
    data: () => ({
      userMenu: false,
      hints: false,
      message: "",
      fav: false,
      drawer: false,
      clipped: true,
      miniNav: true,
      drawerRoutes: {},
      linkedToGoogle: false,
    }),
    components: {
      Avatar,
    },
    beforeCreate() {},
    mounted() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.drawer = false;
        this.$store.dispatch("setNavigationDrawerState", false);
      } else {
        this.drawer = this.navigationDrawer;
      }
      if (this.currentUser) {
      }
    },
    methods: {
      changeNavigationDrawer() {
        this.$store.dispatch("setNavigationDrawerState", !this.drawer);
        this.drawer = !this.drawer;
      },
      resetPassword() {
        console.log(this.currentUser);
        this.$store.dispatch("passwordReset", this.currentUser.email);
        this.$swal({
          title: "Check your inbox",
          text:
            "We've sent you a password reset email. Please follow the instructions to reset your password.",
          type: "success",
          confirmButtonText: "Ok",
        });
        this.forgotPasswordDialog = false;
      },
      linkAccountGoogle() {
        this.$store.dispatch("linkAccountToGoogle").then((result) => {
          if (result == "Success") {
            this.$swal({
              title: "Success!",
              text:
                "Your google account is Linked. You may now sign in with Google",
              type: "success",
              confirmButtonText: "Ok",
            });
            this.linkedToGoogle = true;
          } else {
            this.$swal({
              title: "Failed!",
              text: "This google account was already linked to an Account.",
              type: "error",
              cancelButtonText: "Close",
            });
          }
        });
      },
      updateView() {
        if (this.miniNav == true) {
          this.drawer = false;
          var self = this;
          setTimeout(function () {
            self.drawer = true;
          }, 300);
        }
      },
      appAdminPerms() {
        if (
          this.currentUserData.role == "superAdmin" ||
          this.currentUserData.role == "appAdmin"
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
  };
</script>
