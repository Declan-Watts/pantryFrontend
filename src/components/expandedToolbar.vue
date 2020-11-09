<template>
  <div class="expandedToolbar">
    <div class="expandedToolbarContent">
      <v-row style="padding: 0px 15px;">
        <v-col v-if="newButton" cols="6" sm="3">
          <v-btn
            @click="$emit('newButtonClick')"
            class="iconButton"
            color="white"
            outlined
          >
            <v-icon style="color: white;">mdi-plus</v-icon>New
          </v-btn>
        </v-col>
        <v-col v-if="changeDateRange" cols="6" sm="3">
          <v-btn
            class="iconButton"
            color="white"
            outlined
            @click="$emit('changeDateRangeClick')"
            >Change Date Range</v-btn
          >
          <p v-if="dateRangeFilter" class="btnSubHeader">
            {{ dateRangeFilter.dateRange[0] }} ~
            {{ dateRangeFilter.dateRange[1] }}
          </p>
        </v-col>
        <v-col v-if="getExtendedData" cols="6" sm="3">
          <v-btn
            class="iconButton"
            color="white"
            outlined
            @click="$emit('getExtendedDataClick')"
            >Get Extended Data</v-btn
          >
          <p class="btnSubHeader">Get selected row Extended Data</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["newButton", "changeDateRange", "getExtendedData", "dateRangeFilter"],
  data: () => ({}),
  beforeCreate() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.expandedToolbar {
  background: #38b6ff;
  position: relative;
  width: 100%;
  min-height: 64px;
  box-shadow: 0px 6px 4px 0px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 0px 0px rgba(0, 0, 0, 0.12);
}
.expandedToolbar .btnSubHeader {
  color: white;
  font-size: 12px;
}
</style>
