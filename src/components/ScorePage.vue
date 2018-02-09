<template>
    <div 
      v-bind:class="classObject" 
      v-bind:style="{height: this.compHeight + 'px', width: this.compWidth + 'px'}">
        <div class="imageWrapper">
            <img src="C:\test\1.png" 
                alt="" 
                v-on:click="aClick()"
                v-on:load="imgLoaded()"
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
    },
    imgLoaded() {
      console.log(this.$refs.image);
      this.$refs.image.addEventListener;
      this.originalHeight = this.$refs.image.naturalHeight;
      this.originalWidth = this.$refs.image.naturalWidth;
      this.updateScale();
    },
    updateScale() {
      this.scale = Math.min(
        this.height / this.originalHeight,
        this.width / this.originalWidth
      );
    }
  },
  mounted: function() {},
  watch: {
    height: function(oldVal, newVal) {
      this.updateScale();
    },
    width: function(oldVal, newVal) {
      this.updateScale();
    }
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
