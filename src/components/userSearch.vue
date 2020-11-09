<template>
  <div>
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          Search User
          <v-spacer></v-spacer>
          <v-btn color="white" icon dark @click="$emit('closeSearch')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="user"
                  :items="filteredUsers"
                  item-value="id"
                  item-text="nameAndEmail"
                  label="Search Users by Name or Email"
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('addUser', user)"
            >Add User</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["show", "selectedRowData", "filterByField"],
  computed: {
    ...mapGetters(["users", "usersLoading"])
  },
  data: () => ({
    filteredUsers: [],
    user: {}
  }),
  watch: {
    show: function(oldShow, newShow) {
      let filtered = [];
      this.users.forEach(u => {
        let filter = u[this.filterByField].split(",");
        if (!filter.includes(this.selectedRowData.id)) {
          filtered.push(u);
        }
      });
      this.filteredUsers = filtered;
    }
  },
  beforeCreate() {},
  mounted() {
    this.$store.dispatch("loadUsers");
  },
  methods: {}
};
</script>

<style scoped></style>
