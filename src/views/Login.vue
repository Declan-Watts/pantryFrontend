<template>
  <v-content>
    <v-container class="fill-height mb-2" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card
            tile
            class="elevation-12"
            style="padding-bottom: 15px !important"
          >
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Welcome to Pantry</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <!-- Login -->
              <v-form v-if="!register">
                <v-text-field
                  label="Username"
                  :rules="[(v) => !!v || 'Username is required']"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="loginData.username"
                  required
                ></v-text-field>
                <v-text-field
                  id="password"
                  v-if="!register"
                  :rules="[(v) => !!v || 'Password is required']"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="loginData.password"
                  @keyup.enter="login"
                  required
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePassword = !hidePassword)"
                  :type="hidePassword ? 'password' : 'text'"
                ></v-text-field>
              </v-form>
              <!-- Register -->
              <v-form ref="registerForm" v-if="register">
                <v-text-field
                  label="Username*"
                  :rules="[
                    (v) => !!v || 'Username is required',
                    (v) =>
                      !v.includes(' ') || 'Username Cannot contain a Space',
                  ]"
                  name="register"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="registerData.username"
                  required
                ></v-text-field>
                <v-text-field
                  label="Email*"
                  :rules="emailRules"
                  name="register"
                  prepend-icon="mdi-email"
                  type="text"
                  v-model="registerData.email"
                  required
                ></v-text-field>
                <v-text-field
                  label="Phone Number"
                  name="register"
                  prepend-icon="mdi-phone"
                  type="text"
                  v-model="registerData.phone"
                ></v-text-field>
                <v-text-field
                  id="password"
                  :rules="[
                    (value) => {
                      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
                      return (
                        pattern.test(value) ||
                        'Min. 8 characters with at least one capital letter, a number and a special character.'
                      );
                    },
                  ]"
                  label="Password*"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="registerData.password"
                  required
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePassword = !hidePassword)"
                  :type="hidePassword ? 'password' : 'text'"
                ></v-text-field>
                <v-text-field
                  id="passwordConfirm"
                  :rules="[
                    (v) =>
                      v === registerData.password || 'Passwords Need to Match',
                  ]"
                  label="Confirm Password*"
                  name="passwordConfirm"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="registerData.confirmPassword"
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
                    color="primary"
                    dark
                    :loading="loginLoading"
                    @click="login()"
                    >Login</v-btn
                  >
                </v-col>
                <v-col cols="12" class="pa-0 py-3" @click="register = true">
                  <a style="color: #4188f5; text-decoration: underline"
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
                  <a style="color: #4188f5; text-decoration: underline"
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
        "siteFirstLoad",
      ]),
    },
    data: () => ({
      forgotPasswordDialog: false,
      hidePassword: true,
      loginData: {},
      registerData: {},
      isBusiness: true,
      loginLoading: false,
      loginGoogleLoading: false,
      registerLoading: false,
      register: false,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    }),
    watch: {
      currentUserData(oldUser, newUser) {
        if (this.currentUserData.Result == "Denied" && !this.siteFirstLoad) {
          this.$swal({
            title: "Whoops!",
            text: `This account does not have access to ${this.siteData.name}`,
            type: "warning",
            confirmButtonText: "Ok",
          });
        }
      },
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
        this.$store.dispatch("login", this.loginData).then((result) => {
          if (result.message != "Success") {
            this.$swal({
              title: "Whoops",
              text: "Password or Username was Incorrect",
              type: "warning",
              confirmButtonText: "Retry",
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
          confirmButtonText: "Ok",
        });
        this.forgotPasswordDialog = false;
      },
      registerUser() {
        if (this.$refs.registerForm.validate()) {
          if (this.registerPassword === this.confirmPassword) {
            this.registerLoading = true;
            let _this = this;
            let payload = {
              username: this.registerData.username,
              email: this.registerData.email,
              phoneNumber: this.registerData.phone,
              password: this.registerData.password,
            };
            this.$store.dispatch("registerUser", payload).then((result) => {
              if (result.message == "Failed") {
                this.$swal({
                  title: "Registration Failed",
                  text: result.error["InvalidUserName"].errors[0].errorMessage,
                });
              }
              this.registerLoading = false;
            });
          }
        }
      },
    },
  };
</script>
