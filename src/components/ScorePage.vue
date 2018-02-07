<template>
    <div class="height100 width100" v-bind:class="classObject">
        <div class="height100">
            <img src="C:\test\1.png" alt="" >
        </div>
    </div>
</template>

<script lang="ts">
export default {
  props: {
    side: String,
    validator: function(value: string) {
      return value == "left" || value == "right";
    }
  },
  computed: {
    classObject: function(): any {
      return {
        "sp-left": this.side == "left",
        "sp-right": this.side == "right"
      };
    }
  }
};
</script>

<style scoped>
    img {
        max-width: 100%;
        max-height: 100%;
    }

    .height100 {
        height: 100%;
        max-height: 100%;
    }

    .width100 {
        width: 100%;
        max-width: 100%;
    }

    .sp-left {
        display: flex;
        justify-content: flex-end;
    }
</style>
