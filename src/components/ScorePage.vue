<template>
    <div v-bind:class="classObject">
        <div class="imageWrapper"
            <!-- v-bind:style="{height: this.compHeight + 'px', width: this.compWidth + 'px'}" > -->
            <img src="C:\test\1.png" 
                alt="" 
                v-on:click="aClick()"
                ref="image">
        </div>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      originalHeight: 0,
      originalWidth: 0,
      scale: 1
    };
  },
  props: {
    side: String,
    height: Number,
    width: Number
  },
  computed: {
    classObject: function() {
      return {
        "sp-left": this.side == "left",
        "sp-right": this.side == "right"
      };
    },
    compHeight: function() {
      return this.originalHeight * this.scale;
    },
    compWidth: function() {
      return this.originalWidth * this.scale;
    }
  },
  methods: {
    aClick() {
      alert(
        `OriginalHeight: ${this.originalHeight}. CompHeight: ${this.compHeight}`
      );
    }
  },
  mounted: function() {
    console.log(this.$refs.image);
    this.originalHeight = this.$refs.image.naturalHeight;
    this.originalWidth = this.$refs.image.naturalWidth;
    this.scale = Math.min(
      this.height / this.originalHeight,
      this.width / this.originalWidth
    );
  }
};
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}

/* .sp-left {
        display: flex;
        justify-content: flex-end;
    } */
</style>
