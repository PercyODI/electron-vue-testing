<template>
  <div 
    class="position-relative"
    v-bind:class="classObject" 
    v-bind:style="{height: this.compHeight + 'px', width: this.compWidth + 'px'}">
      <img :src="imgSrc" 
        alt="" 
        class="position-absolute"
        v-on:load="imgLoaded()"
        :height="compHeight"
        :width="compWidth"
        ref="image">
      <svg 
        id="mySvg"
        class="position-absolute"
        :height="compHeight"
        :width="compWidth"
        ref="svg"/>
  </div>
</template>

<script>
import SVG from "svg.js";
export default {
  data: function() {
    return {
      originalHeight: 0,
      originalWidth: 0,
      scale: 1,
      svgjs: undefined,
      primaryGroup: undefined
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
      if (isFinite(this.originalHeight) && isFinite(this.scale))
        return this.originalHeight * this.scale;
      else return 0;
    },
    compWidth: function() {
      if (isFinite(this.originalWidth) && isFinite(this.scale))
        return this.originalWidth * this.scale;
      else return 0;
    },
    imgSrc: function() {
      if (this.img !== undefined) {
        return this.img.src;
      } else {
        return undefined;
      }
    }
  },
  methods: {
    imgLoaded() {
      this.originalHeight = this.$refs.image.naturalHeight;
      this.originalWidth = this.$refs.image.naturalWidth;
      this.updateScale();
    },
    updateScale() {
      this.scale = Math.min(
        this.height / this.originalHeight,
        this.width / this.originalWidth
      );
      if (isFinite(this.scale)) this.primaryGroup.transform({scale: this.scale, cx: 0, cy: 0});
    }
  },
  mounted: function() {
    // console.log(SVG);
    let mySvg = SVG(this.$refs.svg);
    // console.log(this.svgjs);
    let group = mySvg.group();
    group.rect(100, 100).fill("#f03").x(0).y(0);
    this.primaryGroup = group;
    this.svgjs = mySvg;
    mySvg.on("mousemove", (evt) => {
        // console.log(`clientX: ${evt.clientX}, clientY ${evt.clientY}, layerX: ${evt.layerX}, layerY: ${evt.layerY}`)
    })
    mySvg.on("click", (evt) => {
    //   console.log(mySvg.parent());
      let clickedX = evt.clientX - mySvg.parent().offsetLeft;
      let clickedY = evt.clientY - mySvg.parent().offsetTop;
      let newCircle = mySvg.circle(50).cx(clickedX * (1 / this.scale)).cy(clickedY * (1 / this.scale));
      group.add(newCircle);
    })
  },
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
.position-absolute {
  position: absolute;
  top: 0px;
  left: 0px;
}

.position-relative {
  position: relative;
}
/* img {
  width: 100%;
  height: 100%;
} */

/* .sp-left {
        display: flex;
        justify-content: flex-end;
    } */
</style>
