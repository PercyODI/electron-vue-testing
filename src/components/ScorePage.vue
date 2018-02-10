<template>
    <div 
      v-bind:class="classObject" 
      v-bind:style="{height: this.compHeight + 'px', width: this.compWidth + 'px'}">
            <img :src="imgSrc" 
                alt="" 
                v-on:click="aClick()"
                v-on:load="imgLoaded()"
                :height="compHeight"
                :width="compWidth"
                ref="image">
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
    width: Number,
    img: Image
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
    },
    imgSrc: function() {
      if(this.img !== undefined) {
        return this.img.src;
      } else {
        return undefined;
      }
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
/* img {
  width: 100%;
  height: 100%;
} */

/* .sp-left {
        display: flex;
        justify-content: flex-end;
    } */
</style>
