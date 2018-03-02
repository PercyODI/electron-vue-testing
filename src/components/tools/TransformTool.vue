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
  moveMouseDownPoints: {
    realElemPoint: Point;
    rboxElemPoint: Point;
    toolContainerPoint: Point;
  } | null = null;
  mouseDownClickedPoint: Point | null = null;
  // mouseDownElemPoint: Point | null = null;
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
      let realElemPoint = {
        x: group.realElem.x(),
        y: group.realElem.y()
      };
      let rboxElemPoint = {
        x: group.rboxElem.x(),
        y: group.rboxElem.y()
      };
      let toolContainerPoint = {
        x: group.toolContainer.x(),
        y: group.toolContainer.y()
      };
      this.moveMouseDownPoints = {
        realElemPoint,
        rboxElemPoint,
        toolContainerPoint
      };
    }
  }

  moveOnMouseMove(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    if (
      this.mouseDown &&
      !isNullOrUndefined(this.currGroup) &&
      !isNullOrUndefined(this.mouseDownClickedPoint) &&
      !isNullOrUndefined(this.currGroup.toolContainer) &&
      !isNullOrUndefined(this.moveMouseDownPoints)
    ) {
      let mousePoint = clickedPoint(evt, svgjs);

      // Tool Container
      this.currGroup.toolContainer.x(
        this.moveMouseDownPoints.toolContainerPoint.x +
          (mousePoint.x - this.mouseDownClickedPoint.x)
      );
      this.currGroup.toolContainer.y(
        this.moveMouseDownPoints.toolContainerPoint.y +
          (mousePoint.y - this.mouseDownClickedPoint.y)
      );

      // RBox
      this.currGroup.rboxElem.x(
        this.moveMouseDownPoints.rboxElemPoint.x +
          (mousePoint.x - this.mouseDownClickedPoint.x)
      );
      this.currGroup.rboxElem.y(
        this.moveMouseDownPoints.rboxElemPoint.y +
          (mousePoint.y - this.mouseDownClickedPoint.y)
      );

      // Set real element based on RBox location
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
    }
  }

  moveOnMouseUp() {
    this.mouseDown = false;
    this.mouseDownClickedPoint = null;
    this.moveMouseDownPoints = null;
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
      thisGroup.rboxElem.click(() => {
        this.clickedRbox(thisGroup, svgjs);
      });
      this.allGroups.push(thisGroup);
    });
  }

  clickedRbox(group: ToolGroup, svgjs: SVG.Doc) {
    (svgjs as any).off(".transformTool");
    this.clearCurrToolGroup();
    let transformTool = group.toolGroup.group();
    let boundingBox = transformTool
      .rect(
        group.rboxElem.width() + this.transformToolOffset * 2,
        group.rboxElem.height() + this.transformToolOffset * 2
      )
      .move(
        group.rboxElem.x() - this.transformToolOffset,
        group.rboxElem.y() - this.transformToolOffset
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
    boundingBox.on("mousedown.transformTool", (evt: MouseEvent) => {
      this.moveOnMouseDown(evt, group, svgjs);
    });

    svgjs.on("mousemove.transformTool", (evt: MouseEvent) => {
      this.moveOnMouseMove(evt, svgjs);
    });

    svgjs.on("mouseup.transformTool", () => {
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
    (this.currGroup.toolContainer as any).off();
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
