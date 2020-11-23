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
          <v-card-text>
            <v-row> </v-row>
          </v-card-text>
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
    data: () => ({}),
    watch: {
      currentUser: function (oldPI, newPI) {
        if (this.categories != null) {
          this.setGridData();
        }
      },
    },
    mounted() {},
    methods: {
      saveCategory() {
        this.saveCategoryLoading = true;
        this.$store.dispatch("saveCategory", this.viewFormData).then((result) => {
          this.saveCategoryLoading = false;
          this.editMode = false;
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
