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

  setUpEvents(svgjs: SVG.Doc) {
    console.log("Setting up Move Tool Events");
    if (svgjs.select("g#toolGroup").length() > 0) {
      console.log(
        `Tool Group still exists?!?! Found ${svgjs
          .select("g#toolGroup")
          .length()} Tool Groups...`
      );
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
        .fill({ color: "Blue", opacity: 0.4 })
        .click(() => alert("You clicked a RBox!"));
    });
  }

  mounted() {
    console.log("Mounting MoveTool");
    this.svgs.forEach(svgjs => {
      this.setUpEvents(svgjs);
    });
    this.$parent.$on("setUpEvents", this.setUpEvents);
  }

  updated() {
    console.log("Updating MoveTool");
    // this.setUpEvents();
  }

  destroyed() {
    console.log("Destroying MoveTool");
    this.$parent.$off("setUpEvents", this.setUpEvents);
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
