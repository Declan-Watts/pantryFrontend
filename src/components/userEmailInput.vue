<template>
  <div>
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          Search User
          <v-spacer></v-spacer>
          <v-btn color="white" icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="email" label="Users Email"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="loading" color="primary" text @click="$emit('submit', email)">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    props: ["show", "loading"],
    data: () => ({
      email: "",
    }),
    beforeCreate() {},
    mounted() {},
    methods: {},
  };
</script>

<style scoped></style>
