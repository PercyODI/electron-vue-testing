<template>
    <div class="flex-col">
        <select v-model="currentTool">
            <option v-for="tool in toolsList" :key="tool.component.name" :value="tool.component.name">
                {{tool.displayName}}
            </option>
        </select>
        <component :is="currentTool" />
    </div>
</template>


<script lang="ts">
import { Component } from "vue";
import { Vue, Component as ComponentDecorator } from "vue-property-decorator";
import SVG from "svg.js";
import * as CircleToolFile from "./tools/CircleTool.vue";
var CircleTool = CircleToolFile as Component<any>;

import * as FreeDrawToolFile from "./tools/FreeDrawTool.vue";
var FreeDrawTool = FreeDrawToolFile as Component<any>;

export interface ToolbarComponent {
  displayName: string;
  component: Component<any>;
}

@ComponentDecorator({
  name: "LeftToolBar",
  components: {
    CircleTool,
    FreeDrawTool
  }
})
export default class LeftToolBar extends Vue {
  affectedSvgs: SVG.Doc[] = [];
  toolsList: ToolbarComponent[] = [
    { displayName: "Circle Tool", component: CircleTool },
    { displayName: "Free Draw Tool", component: FreeDrawTool }
  ];
  currentTool: string = this.toolsList[1].component.name as string;
  $eventHub: Vue;

  switchToTool(toolName: string) {
    this.currentTool = toolName; // = this.toolsList.filter(x => x.name == toolName)[0];
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
    this.$eventHub.$off("addSvg", this.addSvg);
  }
}
</script>

<style scoped>

</style>
