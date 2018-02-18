<template>
    <div>
        <span>Some Free Draw Things Here!</span>
        <input v-model.number="lineWidth" type="number" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  clickedPoint,
  Point,
  invertScaleOnPoint
} from "./ToolUtilities";
import SVG from "svg.js";

@Component({
  name: "FreeDrawTool"
})
export default class FreeDrawTool extends Vue {
  isMouseDown: boolean = false;
  previousPoint: Point = { x: 0, y: 0 };
  lineWidth: number = 2;
  currentPoints: Point[] = [];
  currentLines: SVG.Line[] = [];

  @Prop() svgs: SVG.Doc[];

  onMouseDown(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
    let scale: number = primaryGroup.transform().scaleX as number;
    console.log(evt);
    this.isMouseDown = true;
    let point = invertScaleOnPoint(clickedPoint(evt, svgjs), scale);
    this.previousPoint = point;
    this.currentPoints.push(point);
  }

  onMouseMove(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
    let scale: number = primaryGroup.transform().scaleX as number;
    if (this.isMouseDown) {
      let currentPoint = invertScaleOnPoint(clickedPoint(evt, svgjs), scale);
      let newLine = primaryGroup
        .line(
          this.previousPoint.x,
          this.previousPoint.y,
          currentPoint.x,
          currentPoint.y
        )
        .stroke({ width: this.lineWidth });
      this.previousPoint = currentPoint;
      this.currentPoints.push(currentPoint);
      this.currentLines.push(newLine);
    }
  }
  onMouseUp(svgjs: SVG.Doc) {
    if (this.isMouseDown) {
      this.convertLinesToPolyline(svgjs);
    }
    this.isMouseDown = false;
    this.currentPoints = [];
    this.currentLines = [];
  }

  onMouseOut() {
    this.isMouseDown = false;
    this.currentPoints = [];
    this.currentLines = [];
  }

  setUpEvents() {
    this.svgs.forEach(svgjs => {
      // let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
      svgjs.touchstart((evt: TouchEvent) => {
        this.onMouseDown(evt, svgjs);
      });
      svgjs.on("mousedown", (evt: MouseEvent) => {
        this.onMouseDown(evt, svgjs);
      });
      svgjs.on("mousemove", (evt: MouseEvent) => {
        this.onMouseMove(evt, svgjs);
      });
      svgjs.touchmove((evt: TouchEvent) => {
        this.onMouseMove(evt, svgjs);
      });
      svgjs.on("mouseup", () => {
        this.onMouseUp(svgjs);
      });
      svgjs.touchend(() => {
        this.onMouseUp(svgjs);
      });
      svgjs.on("mouseout", this.onMouseOut);
      svgjs.touchleave(this.onMouseUp);
    });
  }

  convertLinesToPolyline(svgjs: SVG.Doc) {
    let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
    let result: [number, number][] = [];
    (primaryGroup as any)
      .polyline(
        this.currentPoints.reduce((result, cp, i, array) => {
          if ( i % 3 == 0 || i >= array.length - 3)
            result.push([cp.x, cp.y]);
          return result;
        }, result)
      )
      .stroke({ width: this.lineWidth })
      .fill("none");
    this.currentLines.forEach(line => {
      line.remove();
    });
    // if (this.currentPoints.length > 5) {
    //   let pathString =
    //     `M ${this.currentPoints[0].x} ${this.currentPoints[0].y}` +
    //     ` Q ${this.currentPoints[2].x} ${this.currentPoints[2].y} ${this.currentPoints[5].x} ${this.currentPoints[5].y}`;

    //   for (let i = 7; i < this.currentPoints.length - 2; i += 1) {
    //     pathString =
    //       pathString + ` T ${this.currentPoints[i].x} ${this.currentPoints[i].y}`;
    //   }

    //   console.log(pathString);

    //   primaryGroup
    //     .path(pathString)
    //     .stroke({ width: 2 })
    //     .fill("none");
    //   this.currentLines.forEach(line => {
    //     line.remove();
    //   });
    // }
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