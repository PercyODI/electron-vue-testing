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
    console.log("Setting up Move Tool Events");
    this.svgs.forEach(svgjs => {
      if (svgjs.select("g#toolGroup").length() > 0) {
        console.log("Tool Goup still exists?!?!");
      }
      let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
      console.log("SetUpEvents For Move");
    //   console.log(primaryGroup.svg());
      let toolGroup = svgjs.group().id("toolGroup");
      //   let scale = primaryGroup.transform().scaleX || 1;
      // toolGroup.transform({ scaleX: scale, scaleY: scale, cx: 0, cy: 0 });
      //   let inverseScale = 1 / scale;
      primaryGroup.children().forEach(elem => {
        let elemRBox = elem.rbox(svgjs);
        let newRBRect = toolGroup
          .rect(elemRBox.width, elemRBox.height)
          .move(elemRBox.x, elemRBox.y)
          .fill({ color: "Blue", opacity: 0.4 });
      });
    });
  }

  mounted() {
    console.log("Mounting MoveTool");
    this.setUpEvents();
    this.$parent.$on("svgUpdate", this.setUpEvents);
  }

  destroyed() {
    console.log("Destroying MoveTool");
    this.$parent.$on("svgUpdate", this.setUpEvents);
    this.svgs.forEach(svgjs => {
      let toolGroup: SVG.G = svgjs.select("g#toolGroup").first() as SVG.G;
      if (!isNullOrUndefined(toolGroup)) {
        toolGroup.remove();
      }
    });
  }
}
</script>

<style scoped>

</style>
