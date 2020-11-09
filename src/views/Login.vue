<template>
  <v-content>
    <v-container class="fill-height mb-2" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card
            tile
            class="elevation-12"
            style="padding-bottom: 15px !important;"
          >
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Welcome to Default</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form v-if="!register">
                <v-text-field
                  label="Email"
                  :rules="emailRules"
                  name="login"
                  prepend-icon="mdi-email"
                  type="text"
                  v-model="email"
                  required
                ></v-text-field>
                <v-text-field
                  id="password"
                  v-if="!register"
                  :rules="[v => !!v || 'Password is required']"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                  @keyup.enter="login"
                  required
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePassword = !hidePassword)"
                  :type="hidePassword ? 'password' : 'text'"
                ></v-text-field>
                <v-row class="pa-2">
                  <a
                    @click="forgotPasswordDialog = true"
                    style="cursor: pointer;color:royalblue;text-decoration: underline"
                    class="pa-0"
                    >Forgot Password</a
                  >
                </v-row>
              </v-form>
              <v-form v-if="register">
                <v-text-field
                  label="Full Name"
                  :rules="[v => !!v || 'Name is required']"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="fullName"
                  required
                ></v-text-field>
                <v-text-field
                  label="Email"
                  :rules="emailRules"
                  name="login"
                  prepend-icon="mdi-email"
                  type="text"
                  v-model="email"
                  required
                ></v-text-field>
                <v-text-field
                  id="password"
                  :rules="[v => !!v || 'Password is required']"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="registerPassword"
                  required
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePassword = !hidePassword)"
                  :type="hidePassword ? 'password' : 'text'"
                ></v-text-field>
                <v-text-field
                  id="passwordConfirm"
                  :rules="[
                    v => v === registerPassword || 'Passwords Need to Match'
                  ]"
                  label="Confirm Password"
                  name="passwordConfirm"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="confirmPassword"
                  required
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePassword = !hidePassword)"
                  :type="hidePassword ? 'password' : 'text'"
                ></v-text-field>
              </v-form>
              <v-row v-if="!register" class="pa-0">
                <v-col cols="12" class="pa-0">
                  <v-btn
                    block
                    color="green"
                    dark
                    :loading="loginLoading"
                    @click="login()"
                    >Login</v-btn
                  >
                </v-col>
                <v-col cols="12" class="pa-0 pt-4">
                  <v-btn
                    block
                    color="primary"
                    dark
                    :loading="loginGoogleLoading"
                    @click="loginWithGoogle()"
                    >Login with Google</v-btn
                  >
                </v-col>
                <v-col
                  v-if="false"
                  cols="12"
                  class="pa-0 py-3"
                  @click="register = true"
                >
                  <a style="color:#4188f5;text-decoration: underline;"
                    >Need an account? Register here</a
                  >
                </v-col>
              </v-row>
              <v-row v-if="register" class="pa-0">
                <v-col cols="12" class="pa-0">
                  <v-btn
                    block
                    color="green"
                    dark
                    v-if="register"
                    :loading="registerLoading"
                    @click="registerUser()"
                    >Register</v-btn
                  >
                </v-col>
                <v-col cols="12" class="pa-0 my-3" @click="register = false">
                  <a style="color:#4188f5;text-decoration: underline;"
                    >Already have an account? Login here</a
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="forgotPasswordDialog" max-width="600px">
      <v-card>
        <v-card-text>
          <h2 class="py-2">Password reset</h2>
          <v-text-field
            label="Email"
            :rules="emailRules"
            name="login"
            prepend-icon="mdi-email"
            type="text"
            v-model="email"
            required
          ></v-text-field>
          <v-card-actions>
            <v-btn @click="forgotPasswordDialog = false">cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="forgotPassword()"
              >Reset Password</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";
import { auth } from "@/firebase.js";

export default {
  computed: {
    ...mapGetters([
      "siteData",
      "currentUser",
      "currentUserData",
      "siteFirstLoad"
    ])
  },
  data: () => ({
    forgotPasswordDialog: false,
    hidePassword: true,
    email: "",
    password: "",
    registerPassword: "",
    confirmPassword: "",
    fullName: "",
    businessName: "",
    isBusiness: true,
    loginLoading: false,
    loginGoogleLoading: false,
    registerLoading: false,
    register: false,
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  watch: {
    currentUserData(oldUser, newUser) {
      if (this.currentUserData.Result == "Denied" && !this.siteFirstLoad) {
        this.$swal({
          title: "Whoops!",
          text: `This account does not have access to ${this.siteData.name}`,
          type: "warning",
          confirmButtonText: "Ok"
        });
      }
    }
  },
  mounted() {
    if (this.$route.path === "/register") {
      this.register = true;
    }
    if (this.currentUserData.Result == "Success") {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    login() {
      this.loginLoading = true;
      let _this = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(result => {
          // console.log(result);
          if (typeof result != "undefined") {
            this.$swal({
              title: "Whoops",
              text: "Password or Email was Incorrect",
              type: "warning",
              confirmButtonText: "Retry"
            });
          }
          this.loginLoading = false;
        });
    },
    loginWithGoogle() {
      this.$store.dispatch("loginWithGoogle");
    },
    forgotPassword() {
      this.$store.dispatch("passwordReset", this.email);
      this.$swal({
        title: "Check your inbox",
        text:
          "If we find an account with your email address you will receive a password reset link via email.",
        type: "success",
        confirmButtonText: "Ok"
      });
      this.forgotPasswordDialog = false;
    },
    registerUser() {
      if (this.registerPassword === this.confirmPassword) {
        this.registerLoading = true;
        let _this = this;
        this.$store
          .dispatch("registerUser", {
            email: this.email,
            password: this.confirmPassword,
            name: this.fullName,
            isBusiness: this.isBusiness,
            businessName: this.businessName
          })
          .then(result => {
            if (typeof result != "undefined") {
              this.$swal({
                title: "Sorry",
                text: "Email is Already in Use",
                type: "warning",
                confirmButtonText: "Ok"
              });
            }
            this.registerLoading = false;
          });
      }
    }
  }
};
</script>
