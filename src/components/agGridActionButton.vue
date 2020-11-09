<template>
  <div>
    <v-btn class="mx-2" dark color="grey" icon @click="openActionMenu()">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    data: () => ({}),
    beforeCreate() {},
    mounted() {},
    methods: {
      openActionMenu() {
        this.$store.dispatch("setAGGridActionMenuState", this.params.data);
      }
    }
  };
</script>