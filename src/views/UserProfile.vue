<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="primary" dark>
            Your Profile
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon dark v-bind="attrs" v-on="on">
                  mdi-information-variant
                </v-icon>
              </template>
              <div class="helperToolTip">
                <h1 class="mt-2 mb-2">This is your Profile</h1>
              </div>
            </v-tooltip>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-title>
            Welcome {{ currentUser.details.userName }}
          </v-card-title>
          <v-card-subtitle> This is your profile </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col xs12 sm6>
                <v-text-field
                  label="Email"
                  :rules="emailRules"
                  name="register"
                  prepend-icon="mdi-email"
                  type="text"
                  v-model="formData.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col xs12 sm6>
                <v-text-field
                  label="Phone Number"
                  name="register"
                  prepend-icon="mdi-phone"
                  type="text"
                  v-model="formData.phoneNumber"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer> </v-spacer>
            <v-btn
              color="success"
              class="btn button"
              :loading="saving"
              @click="saveUserData()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import AppBar from "@/components/AppBar";
  import agGridActionButton from "@/components/agGridActionButton";
  import expandedToolbar from "@/components/expandedToolbar.vue";
  import { AgGridVue } from "ag-grid-vue";
  import moment from "moment";

  export default {
    components: {
      AppBar,
      AgGridVue,
      agGridActionButton,
      expandedToolbar,
    },
    computed: {
      ...mapGetters(["currentUser"]),
    },
    props: {
      source: String,
    },
    data: () => ({
      formData: {},
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      saving: false,
    }),
    watch: {},
    mounted() {
      this.formData = {
        email: this.currentUser.details.email,
        phoneNumber: this.currentUser.details.phoneNumber,
      };
    },
    methods: {
      saveUserData() {
        this.saving = true;
        this.$store.dispatch("saveUser", this.formData).then((result) => {
          this.saving = false;
          if (result.Result == "Success") {
            this.$swal({
              title: "Success!",
              text: "The Category Successfully Saved",
              type: "success",
              confirmButtonText: "Ok",
            });
          } else {
            this.$swal({
              title: "Error!",
              text: "There was an Error, Please try again later",
              type: "error",
              confirmButtonText: "Ok",
            });
          }
        });
      },
    },
  };
  window.categoryNameFormatter = function categoryNameFormatter(params) {
    return params.data.categories.name;
  };
</script>

<style>
  .croppa-container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .croppa-container canvas {
    border: 1px solid;
  }
</style>
