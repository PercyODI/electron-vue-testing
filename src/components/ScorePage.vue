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


<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as SVG from "svg.js";
import { isNullOrUndefined } from 'util';

@Component
export default class ScorePage extends Vue {
  originalHeight = 0;
  originalWidth = 0;
  scale = 1;
  svgjs: SVG.Doc;
  primaryGroup: SVG.G;
  $eventHub: Vue;

  @Prop() side: string;
  @Prop() height: number;
  @Prop() width: number;
  @Prop() img: HTMLImageElement;
  get classObject() {
    return {
      "sp-left": this.side == "left",
      "sp-right": this.side == "right"
    };
  }

  get compHeight() {
    if (isFinite(this.originalHeight) && isFinite(this.scale))
      return this.originalHeight * this.scale;
    else return 0;
  }

  get compWidth() {
    if (isFinite(this.originalWidth) && isFinite(this.scale))
      return this.originalWidth * this.scale;
    else return 0;
  }

  get imgSrc() {
    if (this.img !== undefined) {
      return this.img.src;
    } else {
      return undefined;
    }
  }

  imgLoaded() {
    this.originalHeight = (this.$refs.image as HTMLImageElement).naturalHeight;
    this.originalWidth = (this.$refs.image as HTMLImageElement).naturalWidth;
    this.updateScale();
  }
  updateScale() {
    this.scale = Math.min(
      this.height / this.originalHeight,
      this.width / this.originalWidth
    );
    if (isFinite(this.scale) && !isNullOrUndefined(this.primaryGroup))
      this.primaryGroup.transform({
        scaleX: this.scale,
        scaleY: this.scale,
        cx: 0,
        cy: 0
      });
  }

  mounted() {
    let mySvg = SVG(this.$refs.svg as HTMLElement);
    // console.log(this.svgjs);
    let group = mySvg.group();
    group.id("primaryGroup");
    group
      .rect(100, 100)
      .fill("#f03")
      .x(0)
      .y(0);
    this.primaryGroup = group;
    this.svgjs = mySvg;
    this.$eventHub.$emit("addSvg", this.svgjs);
  }

  @Watch("height")
  watchingHeight() {
    this.updateScale();
  }

  @Watch("width")
  watchingWidth() {
    this.updateScale();
  }
}
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
