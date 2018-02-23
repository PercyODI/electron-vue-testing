<template>

</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  clickedPoint,
  Point,
  invertScaleOnPoint,
  primaryGroupScale
} from "./ToolUtilities";
import { isNullOrUndefined } from "util";
import SVG from "svg.js";
import {EventHub} from "../EventHub";

export interface toolToRealPair {
  realElem: SVG.Element;
  toolElem: SVG.Element;
}

@Component({
  name: "MoveTool"
})
export default class MoveTool extends Vue {
  elements: toolToRealPair[] = [];
  currPair: toolToRealPair | null = null;
  mouseDownClickedPoint: Point | null = null;
  mouseDownElemPoint: Point | null = null;

  mouseDown: Boolean = false;
  $eventHub: EventHub;

  @Prop() svgs: SVG.Doc[];

  onMouseDown(
    evt: MouseEvent | TouchEvent,
    pair: toolToRealPair,
    svgjs: SVG.Doc
  ) {
    console.log("mouseDown on " + pair.realElem.id());
    this.currPair = pair;
    this.mouseDown = true;
    this.mouseDownClickedPoint = clickedPoint(evt, svgjs);
    this.mouseDownElemPoint = {
      x: pair.toolElem.x(),
      y: pair.toolElem.y()
    };
  }

  onMouseMove(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    if (
      this.mouseDown &&
      !isNullOrUndefined(this.currPair) &&
      !isNullOrUndefined(this.mouseDownClickedPoint) &&
      !isNullOrUndefined(this.mouseDownElemPoint)
    ) {
      let mousePoint = clickedPoint(evt, svgjs);
      this.currPair.toolElem.x(
        this.mouseDownElemPoint.x +
          (mousePoint.x - this.mouseDownClickedPoint.x)
      );
      this.currPair.toolElem.y(
        this.mouseDownElemPoint.y +
          (mousePoint.y - this.mouseDownClickedPoint.y)
      );

      let scale = primaryGroupScale(svgjs);
      let newRealElemPoint = invertScaleOnPoint(
        { x: this.currPair.toolElem.x(), y: this.currPair.toolElem.y() },
        scale
      );
      this.currPair.realElem.x(newRealElemPoint.x);
      this.currPair.realElem.y(newRealElemPoint.y);

      console.log(
        "Moving from " +
          JSON.stringify(this.mouseDownClickedPoint) +
          " to " +
          JSON.stringify(mousePoint)
      );
    }
  }

  onMouseUp(evt: MouseEvent | TouchEvent) {
    this.mouseDown = false;
    this.currPair = null;
    this.mouseDownClickedPoint = null;
    this.$eventHub.saveSvg();
  }

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
    let toolGroup = svgjs.group().id("toolGroup");
    primaryGroup.children().forEach(elem => {
      let elemRBox = (elem.rbox as Function)(svgjs);
      let newRBRect = toolGroup
        .rect(elemRBox.width, elemRBox.height)
        .move(elemRBox.x, elemRBox.y)
        .fill({ color: "Blue", opacity: 0.4 });
      let thisPair = {
        realElem: elem,
        toolElem: newRBRect
      };

      newRBRect.mousedown((evt: MouseEvent) => {
        this.onMouseDown(evt, thisPair, svgjs);
      });
      newRBRect.mousemove((evt: MouseEvent) => {
        this.onMouseMove(evt, svgjs);
      });
      svgjs.mouseup((evt: MouseEvent) => {
        this.onMouseUp(evt);
      });
      this.elements.push(thisPair);
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
