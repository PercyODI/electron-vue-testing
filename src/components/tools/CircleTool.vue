<template>
    <div>
        <span>Some Circle Tool Things</span>
    </div>
</template>

<script lang="ts">
import {
  Vue,
  Component as ComponentDecorator,
  Prop
} from "vue-property-decorator";
import { invertScale, clickedPoint } from "./ToolUtilities";
import SVG from "svg.js";

@ComponentDecorator({
  name: "CircleTool"
})
export default class CircleTool extends Vue {

  @Prop() svgs: SVG.Doc[];

  setUpEvents() {
    this.svgs.forEach(svgjs => {
      svgjs.on("click", (evt: MouseEvent) => {
        let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
        let scale: number = primaryGroup.transform().scaleX as number;
        //   console.log(mySvg.parent());
        let mousePoint = clickedPoint(evt, svgjs);
        let newCircle = svgjs
          .circle(50)
          .cx(mousePoint.x * invertScale(scale))
          .cy(mousePoint.y * invertScale(scale))
          .fill("blue");
        primaryGroup.add(newCircle);
      });
    });
  }

  mounted() {
    this.setUpEvents();
    this.$parent.$on("svgUpdate", this.setUpEvents);
  }

  destroyed() {
    this.$parent.$off("svgUpdate", this.setUpEvents);
  }
}
</script>

<style scoped>

</style>