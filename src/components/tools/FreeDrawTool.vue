<template>
<div>
    <span>Some Free Draw Things Here!</span>
    <div class="flex-col textSize">
        <div class="flex-grow flex-align-center text-center">{{lineWidth}}</div>
        <div class="flex-row">
            <button class="flex-grow buttonSize" @click="lineWidth++">+</button>
            <button class="flex-grow buttonSize" @click="lineWidth--">-</button>
        </div>
        <svg width="140" height="50">
        <polyline points="5,5 135,45" stroke="#000000" :stroke-width="lineWidth" fill="none"></polyline>
        </svg>
    </div>
</div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { clickedPoint, Point, invertScaleOnPoint } from "./ToolUtilities";
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
  $eventHub: Vue;

  @Prop() svgs: SVG.Doc[];

  onMouseDown(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc) {
    let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
    let scale: number = primaryGroup.transform().scaleX as number;
    // console.log(evt);
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
    if (this.currentLines.length > 0) {
      this.convertLinesToPolyline(svgjs);
    }
    this.isMouseDown = false;
    this.currentPoints = [];
    this.currentLines = [];
    this.$eventHub.$emit("saveSvg");
  }

  onMouseOut(svgjs: SVG.Doc) {
    if (this.currentLines.length > 0) {
      this.convertLinesToPolyline(svgjs);
    }
    this.isMouseDown = false;
    this.currentPoints = [];
    this.currentLines = [];
  }

  setUpEvents(svgjs: SVG.Doc) {
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
      // svgjs.on("mouseout", () => {
      //   this.onMouseOut(svgjs);
      // });
      // svgjs.touchleave(this.onMouseUp);
  }

  convertLinesToPolyline(svgjs: SVG.Doc) {
    let primaryGroup: SVG.G = svgjs.select("g#primaryGroup").first() as SVG.G;
    let result: [number, number][] = [];
    (primaryGroup as any)
      .polyline(
        this.currentPoints.reduce((result, cp, i, array) => {
          if (i % 3 == 0 || i >= array.length - 3) result.push([cp.x, cp.y]);
          return result;
        }, result)
      )
      .stroke({ width: this.lineWidth })
      .fill("none");
    this.currentLines.forEach(line => {
      line.remove();
    });
  }

  mounted() {
    this.svgs.forEach(svgjs => this.setUpEvents(svgjs));
    this.$parent.$on("setUpEvents", this.setUpEvents);
  }

  destroyed() {
    this.$parent.$off("setUpEvents", this.setUpEvents);
  }
}
</script>

<style scoped>
.textSize {
  font-size: 24pt;
}

.buttonSize {
  font-size: 18pt;
}

.text-center {
  text-align: center;
}
</style>
