<template>
  <div 
    class="position-relative"
    v-bind:class="classObject" 
    v-bind:style="{height: this.compHeight + 'px', width: this.compWidth + 'px'}"
    >
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
import * as fs from "fs";
import * as path from "path";
import { isNullOrUndefined } from "util";
import { SharedFile } from "../models/SharedFiles";
import { EventHub } from "./EventHub";

@Component({
  name: "ScorePage"
})
export default class ScorePage extends Vue {
  originalHeight = 0;
  originalWidth = 0;
  scale = 1;
  svgjs: SVG.Doc | null = null;
  $eventHub: EventHub;

  @Prop() height: number;
  @Prop() width: number;
  @Prop() files: SharedFile;

  $refs: {
    image: HTMLImageElement;
    svg: HTMLElement;
  };

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
    if (this.files.image !== undefined) {
      return this.files.image.src;
    } else {
      return undefined;
    }
  }

  imgLoaded() {
    console.log("Image Loaded");
    this.originalHeight = this.$refs.image.naturalHeight;
    this.originalWidth = this.$refs.image.naturalWidth;
    this.updateScale();
  }

  updateScale() {
    console.log("Updating Scale");
    this.scale = Math.min(
      this.height / this.originalHeight,
      this.width / this.originalWidth
    );

    let pGroup = this.buildPrimaryGroup();
    if (isFinite(this.scale))
      pGroup.transform({
        scaleX: this.scale,
        scaleY: this.scale,
        cx: 0,
        cy: 0
      });
  }

  saveSvg() {
    let parsedImageSrc = path.parse(this.files.image.src);
    console.log(parsedImageSrc);
    let svgFilePath = this.files.baseFileName + ".svg";
    console.log(this.files.baseFileName);
    console.log(svgFilePath);
    let pGroup = this.buildPrimaryGroup();
    let svgBuildString = pGroup.children().reduce((acc, e) => {
      return acc + e.svg();
    }, "");
    this.files.svg = svgBuildString;
    fs.writeFileSync(svgFilePath, svgBuildString, "utf8");
  }

  buildPrimaryGroup(): SVG.G {
    let svgjs = this.svgjs;
    if (isNullOrUndefined(svgjs)) {
      svgjs = this.buildSvgjs();
    }

    let primaryGroup;
    if (svgjs.select("g#primaryGroup").length() > 0) {
      primaryGroup = svgjs.select("g#primaryGroup").first() as SVG.G;
    } else {
      primaryGroup = svgjs.group().id("primaryGroup");
    }
    return primaryGroup;
  }

  buildSvgjs(): SVG.Doc {
    if (isNullOrUndefined(this.svgjs)) {
      let mySvg = SVG(this.$refs.svg);
      this.svgjs = mySvg;
      this.$eventHub.addSvg(this.svgjs);
    }

    return this.svgjs;
  }

  importOrCreateSvg(): SVG.Doc {
    let svg = this.buildSvgjs();
    let primaryGroup = this.buildPrimaryGroup();
    primaryGroup.clear();

    if (!isNullOrUndefined(this.files.svg) && this.files.svg !== "") {
      primaryGroup.svg(this.files.svg);
    }
    if (isNullOrUndefined(svg)) {
      console.log("svg in importOrCreateSvg is null....");
    }
    return svg;
  }

  created() {
    this.$eventHub.onSaveSvgListener(this.saveSvg);
  }

  destroyed() {
    this.$eventHub.offSaveSvgListener(this.saveSvg);
  }

  mounted() {
    console.log("Mounting ScorePage");
    let svgjs = this.importOrCreateSvg();
    this.$eventHub.updateSvg(svgjs);
  }

  updated() {
    console.log("ScorePage Updated");
    console.log(this.files);
    this.updateScale();
    let svgjs = this.importOrCreateSvg();
    this.$eventHub.updateSvg(svgjs);
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
</style>
