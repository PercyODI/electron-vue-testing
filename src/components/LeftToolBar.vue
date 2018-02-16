<template>
    <div class="flex-col">
        <button @click="switchToTool('FreeDraw')">Free Draw</button>
        <button @click="switchToTool('Rectangle')">Rectangle</button>
        <p> Currently Selected Tool: {{currentTool}}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SVG from "svg.js";

@Component({
    name: "LeftToolBar"
})
export class LeftToolBar extends Vue {
  currentTool = "FreeDraw";
  affectedSvgs: SVG.Doc[] = [];
  $eventHub: Vue;

  switchToTool(toolName: string) {
    this.currentTool = toolName;
  }

  addSvg(svg: SVG.Doc) {
    this.affectedSvgs.push(svg);
    this.updateSvgEvents();
  }

  removeSvg(svg: SVG.Doc) {
      this.affectedSvgs.filter(x => x != svg);
      this.updateSvgEvents();
  }

  updateSvgEvents() {
    this.affectedSvgs.forEach(svgjs => {
      console.log("updating events " + svgjs);
      svgjs.on("click", (evt: MouseEvent) => {
        console.log(evt);
        let primaryGroup: SVG.G = svgjs.get(1) as SVG.G;
        console.log(primaryGroup);
        let scale: number = primaryGroup.transform().scaleX as number;
        //   console.log(mySvg.parent());
        let clickedX = evt.clientX - svgjs.parent().offsetLeft;
        let clickedY = evt.clientY - svgjs.parent().offsetTop;
        let newCircle = svgjs
          .circle(50)
          .cx(clickedX * (1 / scale))
          .cy(clickedY * (1 / scale))
          .fill("blue");
        primaryGroup.add(newCircle);
      });
    });
  }
  created() {
    this.$eventHub.$on("addSvg", this.addSvg);
  }
  beforeDestroy() {
    this.$eventHub.$off("addSvg");
  }
}
export default LeftToolBar;
</script>

<style scoped>

</style>
