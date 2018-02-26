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
import * as SVG from "svg.js";
import { EventHub } from "../EventHub";

export interface ToolGroup {
  realElem: SVG.Element;
  rboxElem: SVG.Element;
  toolContainer?: SVG.Container;
  toolGroup: SVG.G;
}

@Component({
  name: "TransformTool"
})
export default class TransformTool extends Vue {
  allGroups: ToolGroup[] = [];
  currGroup: ToolGroup | null = null;
  mouseDownPoints: {
      realElemPoint: number;
      rboxElemPoint: number;
      toolContainerPoint: number;
  }
  mouseDownClickedPoint: Point | null = null;
  mouseDownElemPoint: Point | null = null;
  transformToolOffset: number = 3;

  mouseDown: Boolean = false;
  $eventHub: EventHub;

  @Prop() svgs: SVG.Doc[];

  moveOnMouseDown(
    evt: MouseEvent | TouchEvent,
    group: ToolGroup,
    svgjs: SVG.Doc
  ) {
    if (!isNullOrUndefined(group.toolContainer)) {
      this.currGroup = group;
      this.mouseDown = true;
      this.mouseDownClickedPoint = clickedPoint(evt, svgjs);
      this.mouseDownElemPoint = {
        x: group.toolContainer.x(),
        y: group.toolContainer.y()
      };
    }
  }

  moveOnMouseMove(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    if (
      this.mouseDown &&
      !isNullOrUndefined(this.currGroup) &&
      !isNullOrUndefined(this.mouseDownClickedPoint) &&
      !isNullOrUndefined(this.mouseDownElemPoint) &&
      !isNullOrUndefined(this.currGroup.toolContainer)
    ) {
      let mousePoint = clickedPoint(evt, svgjs);

      this.currGroup.toolContainer.x(
        this.mouseDownElemPoint.x +
          (mousePoint.x - this.mouseDownClickedPoint.x)
      );
      this.currGroup.toolContainer.y(
        this.mouseDownElemPoint.y +
          (mousePoint.y - this.mouseDownClickedPoint.y)
      );

      this.currGroup.rboxElem.x(
        this.mouseDownElemPoint.x +
          (mousePoint.x - this.mouseDownClickedPoint.x)
      );
      this.currGroup.rboxElem.y(
        this.mouseDownElemPoint.y +
          (mousePoint.y - this.mouseDownClickedPoint.y)
      );

      let scale = primaryGroupScale(svgjs);
      let newRealElemPoint = invertScaleOnPoint(
        {
          x: this.currGroup.rboxElem.x(),
          y: this.currGroup.rboxElem.y()
        },
        scale
      );
      this.currGroup.realElem.x(newRealElemPoint.x);
      this.currGroup.realElem.y(newRealElemPoint.y);

      console.log(
        "Moving from " +
          JSON.stringify(this.mouseDownClickedPoint) +
          " to " +
          JSON.stringify(mousePoint)
      );
    }
  }

  moveOnMouseUp() {
    this.mouseDown = false;
    this.currGroup = null;
    this.mouseDownClickedPoint = null;
    this.mouseDownElemPoint = null;
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
        // .fill("none");
        .fill({ color: "Blue", opacity: 0.2 });
      let thisGroup: ToolGroup = {
        realElem: elem,
        rboxElem: newRBRect,
        toolGroup: toolGroup
      };
      thisGroup.rboxElem.click((evt: MouseEvent) => {
        this.clickedRbox(evt, thisGroup, svgjs);
      });
      this.allGroups.push(thisGroup);
    });
  }

  clickedRbox(evt: MouseEvent | TouchEvent, group: ToolGroup, svgjs: SVG.Doc) {
    this.clearCurrToolGroup();
    let transformTool = group.toolGroup.group();
    let boundingBox = transformTool
      .rect(
        group.rboxElem.width() + this.transformToolOffset * 2,
        group.rboxElem.height() + this.transformToolOffset * 2
      )
      .move(
        group.rboxElem.x() - this.transformToolOffset * 2,
        group.rboxElem.y() - this.transformToolOffset * 2
      )
      .stroke({ dasharray: "5, 10", color: "black" })
      .fill({ color: "Red", opacity: 0.2 });

    let topLeftCircle = transformTool.add(
      this.buildToolCircle(boundingBox.x(), boundingBox.y())
    );
    let topRightCircle = transformTool.add(
      this.buildToolCircle(
        boundingBox.x() + boundingBox.width(),
        boundingBox.y()
      )
    );
    let bottomLeftCircle = transformTool.add(
      this.buildToolCircle(
        boundingBox.x(),
        boundingBox.y() + boundingBox.height()
      )
    );
    let bottomRightCircle = transformTool.add(
      this.buildToolCircle(
        boundingBox.x() + boundingBox.width(),
        boundingBox.y() + boundingBox.height()
      )
    );

    group.toolContainer = transformTool;
    this.currGroup = group;

    // Setup events for the new Transform Tool elements
    boundingBox.mousedown((evt: MouseEvent) => {
      this.moveOnMouseDown(evt, group, svgjs);
    });

    boundingBox.mousemove((evt: MouseEvent) => {
      this.moveOnMouseMove(evt, svgjs);
    });

    boundingBox.mouseup(() => {
      this.moveOnMouseUp();
    });
  }

  clearCurrToolGroup() {
    if (
      isNullOrUndefined(this.currGroup) ||
      isNullOrUndefined(this.currGroup.toolContainer)
    ) {
      return;
    }
    this.currGroup.toolContainer.remove();
  }

  buildToolCircle(cx: number, cy: number) {
    let circle = new SVG.Circle();
    circle
      .radius(6)
      .cx(cx)
      .cy(cy)
      .fill("grey")
      .stroke({ color: "black", width: 1 });

    return circle;
  }

  mounted() {
    console.log("Mounting Transform Tool");
    this.svgs.forEach(svgjs => {
      this.setUpEvents(svgjs);
    });
    this.$parent.$on("setUpEvents", this.setUpEvents);
  }

  updated() {
    console.log("Updating Transform Tool");
    // this.setUpEvents();
  }

  destroyed() {
    console.log("Destroying Transform Tool");
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
