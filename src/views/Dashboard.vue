<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Currently Nothing on the Dashboard, Please use the Navigation Drawer
          </v-card-title>
          <p>
            <pre>
              {{siteData}}
            </pre>
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import AppBar from "@/components/AppBar";

  export default {
    components: { AppBar },
    computed: {
      ...mapGetters(["currentUser", "siteData"]),
    },
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      linkedToGoogle: false,
    }),
    mounted() {
      if (this.currentUser) {
        this.currentUser.providerData.forEach((element) => {
          if (element.providerId == "google.com") {
            this.linkedToGoogle = true;
          }
        });
      }

      // this.$store.dispatch("loadSiteData");
    },
    methods: {
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
    },
  };
</script>
