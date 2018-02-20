<template>

</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { clickedPoint, Point, invertScaleOnPoint } from "./ToolUtilities";
import { isNullOrUndefined } from "util";
import SVG from "svg.js";

@Component({
  name: "MoveTool"
})
export default class MoveTool extends Vue {
  @Prop() svgs: SVG.Doc[];

  setUpEvents() {
    this.svgs.forEach(svgjs => {
      let toolGroup: SVG.G = svgjs.select("g#toolGroup").first() as SVG.G;
      if(!isNullOrUndefined(toolGroup))
      toolGroup.remove();
    });
    this.svgs.forEach(svgjs => {
      let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
      let toolGroup = svgjs.group().id("toolGroup");
      let scale = primaryGroup.transform().scaleX || 1;
      // toolGroup.transform({ scaleX: scale, scaleY: scale, cx: 0, cy: 0 });
      let inverseScale = 1 / scale;
      primaryGroup.children().forEach(elem => {
        let elemRBox = elem.bbox();
        let newRBRect = toolGroup
          .rect(elemRBox.width, elemRBox.height)
          .move(elemRBox.x, elemRBox.y)
          .fill({ color: "Blue", opacity: 0.4 });
      });
    });
  }

  mounted() {
    this.setUpEvents();
    this.$parent.$on("svgUpdate", this.setUpEvents);
  }

  destroyed() {
    this.$parent.$on("svgUpdate", this.setUpEvents);
    this.svgs.forEach(svgjs => {
      let toolGroup: SVG.G = svgjs.select("g#toolGroup").first() as SVG.G;
      toolGroup.remove();
    });
  }
}
</script>

<style scoped>

</style>
