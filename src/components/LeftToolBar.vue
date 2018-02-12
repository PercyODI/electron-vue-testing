<template>
    <div class="flex-col">
        <button @click="switchToTool('FreeDraw')">Free Draw</button>
        <button @click="switchToTool('Rectangle')">Rectangle</button>
        <p> Currently Selected Tool: {{currentTool}}</p>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      currentTool: "FreeDraw",
      affectedSvgs: []
    };
  },
  methods: {
    switchToTool(toolName) {
      this.currentTool = toolName;
    },
    addSvg(svg) {
      this.affectedSvgs.push(svg);
      this.updateSvgEvents();
    },
    updateSvgEvents() {
      this.affectedSvgs.forEach(svgjs => {
        console.log("updateing events " + svgjs);
        svgjs.on("click", evt => {
          console.log(evt);
          let primaryGroup = svgjs.get('primaryGroup');
          let scale = primaryGroup.transform("scaleX");
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
  },
  created() {
    this.$eventHub.$on("addSvg", this.addSvg);
  },
  beforeDestroy() {
    this.$eventHub.$off("addSvg");
  }
};
</script>

<style scoped>

</style>
