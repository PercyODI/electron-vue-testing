<template>
    <div>
        <span>Some Circle Tool Things</span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { clearInterval } from 'timers';
// import SVG from "svg.js";

@Component({
    name: "CircleTool"
})
export default class CircleTool extends Vue {
    displayName = "Circle Tool";
    setNum: any = 0;
    mounted() {
        this.setNum = setInterval(() => {
            console.log("Hello from CircleTool!");
        }, 1000);
    }

    destroyed() {
        clearInterval(this.setNum);
    }
}

</script>

<style scoped>

</style>