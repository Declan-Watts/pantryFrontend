<template>
  <div>
    <div
      v-if="params.data.activeDeployment > 0"
      style="background: rgba(185,246,202,.4);
}; text-align: center;"
    >
      {{ deploymentText() }}
    </div>
    <div v-else style="background: rgba(255,128,171,.4);  text-align: center;">
      {{ deploymentText() }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({}),
  beforeCreate() {},
  mounted() {},
  methods: {
    deploymentColor() {
      switch (this.params.data.activeDeployment) {
        case 1:
          return "green";
          break;

        default:
          return "red";
          break;
      }
    },
    deploymentText() {
      if (this.params.data.activeDeployment > 0) {
        return "Deployed";
      } else {
        return "Not-Deployed";
      }
    }
  }
};
</script>
