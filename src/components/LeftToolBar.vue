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
import { EventHub } from "./EventHub";
import * as CircleToolFile from "./tools/CircleTool.vue";
var CircleTool = CircleToolFile as Component<any>;

import * as FreeDrawToolFile from "./tools/FreeDrawTool.vue";
var FreeDrawTool = FreeDrawToolFile as Component<any>;

import * as MoveToolFile from "./tools/MoveTool.vue";
var MoveTool = MoveToolFile as Component<any>;

import * as TransformToolFile from "./tools/TransformTool.vue";
var TransformTool = TransformToolFile as Component<any>;

export interface ToolbarComponent {
  displayName: string;
  component: Component<any>;
}

@ComponentDecorator({
  name: "LeftToolBar",
  components: {
    CircleTool,
    FreeDrawTool,
    MoveTool,
    TransformTool
  }
})
export default class LeftToolBar extends Vue {
  affectedSvgs: SVG.Doc[] = [];
  toolsList: ToolbarComponent[] = [
    { displayName: "Circle Tool", component: CircleTool },
    { displayName: "Free Draw Tool", component: FreeDrawTool },
    { displayName: "Move Tool", component: MoveTool }
    { displayName: "Transform Tool", component: TransformTool }
  ];
  currentTool: string = "";
  $eventHub: EventHub;

  switchToTool(toolName: string) {
    this.currentTool = toolName;
  }

  addSvg(svg: SVG.Doc) {
    this.affectedSvgs.push(svg);
  }

  removeSvg(svg: SVG.Doc) {
    this.affectedSvgs.filter(x => x != svg);
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
    this.$eventHub.onAddSvgListener(this.addSvg);
    this.$eventHub.onUpdateSvgListener(this.updateSvg);
  }

  beforeDestroy() {
    this.$eventHub.offAddSvgListener(this.addSvg);
    this.$eventHub.offUpdateSvgListener(this.updateSvg);
  }
}
</script>

<style scoped>

</style>
