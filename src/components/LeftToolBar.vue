<template>
    <div class="flex-col">
        <select v-model="currentTool">
            <option v-for="tool in toolsList" :key="tool.component.name" :value="tool.component.name">
                {{tool.displayName}}
            </option>
        </select>
        <component :is="currentTool" :svgs="affectedSvgs" />
    </div>
</template>


<script lang="ts">
import { Component } from "vue";
import {
  Vue,
  Component as ComponentDecorator,
  Watch
} from "vue-property-decorator";
import SVG from "svg.js";
import { isNullOrUndefined } from "util";
import * as CircleToolFile from "./tools/CircleTool.vue";
var CircleTool = CircleToolFile as Component<any>;

import * as FreeDrawToolFile from "./tools/FreeDrawTool.vue";
var FreeDrawTool = FreeDrawToolFile as Component<any>;

import * as MoveToolFile from "./tools/MoveTool.vue";
var MoveTool = MoveToolFile as Component<any>;

export interface ToolbarComponent {
  displayName: string;
  component: Component<any>;
}

@ComponentDecorator({
  name: "LeftToolBar",
  components: {
    CircleTool,
    FreeDrawTool,
    MoveTool
  }
})
export default class LeftToolBar extends Vue {
  affectedSvgs: SVG.Doc[] = [];
  toolsList: ToolbarComponent[] = [
    { displayName: "Circle Tool", component: CircleTool },
    { displayName: "Free Draw Tool", component: FreeDrawTool },
    { displayName: "Move Tool", component: MoveTool }
  ];
  currentTool: string = ""; //this.toolsList[1].component.name as string;
  $eventHub: Vue;

  switchToTool(toolName: string) {
    this.currentTool = toolName; // = this.toolsList.filter(x => x.name == toolName)[0];
  }

  addSvg(svg: SVG.Doc) {
    this.affectedSvgs.push(svg);
    // this.updateSvgEvents();
  }

  removeSvg(svg: SVG.Doc) {
    this.affectedSvgs.filter(x => x != svg);
    // this.updateSvgEvents();
  }

  removeAllSvgEvents(svgjs: SVG.Doc): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let toolGroups = svgjs.select("g#toolGroup");
        if (!isNullOrUndefined(toolGroups)) {
          console.log(`Removing ${toolGroups.length()} Tool Group(s)`);
          toolGroups.each((i, array) => array[i].remove());
          console.log(
            `Now there are ${svgjs.select("g#toolGroup").length()} tool groups.`
          );
        }
        (svgjs as any).off();
        svgjs.each(function(_, children) {
          // console.log(children);
          children.forEach(child => {
            (child as any).off();
          });
        }, true);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  @Watch("currentTool")
  currentToolChange() {
    this.affectedSvgs.forEach(svgjs => {
      this.removeAllSvgEvents(svgjs);
    });
  }

  updateSvg(svgjs: SVG.Doc) {
    this.removeAllSvgEvents(svgjs).then(() => {
      console.log("Emitting svgUpdate");
      this.$emit("setUpEvents", svgjs);
    });
  }

  created() {
    this.$eventHub.$on("addSvg", this.addSvg);
    this.$eventHub.$on("updateSvg", this.updateSvg);
  }
  beforeDestroy() {
    this.$eventHub.$off("addSvg", this.addSvg);
  }
}
</script>

<style scoped>

</style>
