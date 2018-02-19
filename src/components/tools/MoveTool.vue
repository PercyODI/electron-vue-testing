<template>

</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { clickedPoint, Point, invertScaleOnPoint } from "./ToolUtilities";
import SVG from "svg.js";

@Component({
  name: "MoveTool"
})
export default class MoveTool extends Vue {
  @Prop() svgs: SVG.Doc[];

  setUpEvents() {
    this.svgs.forEach(svgjs => {
      let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
      primaryGroup.children().forEach(elem => {
        elem.rbox();
      });
    });
  }

  mounted() {
    this.setUpEvents();
    this.$parent.$on("svgUpdate", this.setUpEvents);
    this.svgs.forEach(svgjs => {
      let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
      let toolGroup = svgjs.group().id("toolGroup");
      toolGroup.transform(primaryGroup.transform());
      let inverseScale = 1 / primaryGroup.transform().scaleX;
      primaryGroup.children().forEach(elem => {
        let elemRBox = elem.rbox();
        let newRBRect = toolGroup
          .rect(elemRBox.width * inverseScale, elemRBox.height * inverseScale)
          .move(elemRBox.x * inverseScale, elemRBox.y * inverseScale)
          .fill({ color: "Blue", opacity: 0.4 });
      });
    });
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
