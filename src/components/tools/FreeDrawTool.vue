<template>
    <div>
        <span>Some Free Draw Things Here!</span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
// import SVG from "svg.js";

@Component({
    name: "FreeDrawTool"
})
export default class FreeDrawTool extends Vue {
    displayName = "Free Draw Tool";

    setNum: any = 0;
    mounted() {
        this.setNum = setInterval(() => {
            console.log("Hello from FreeDrawTool!");
        }, 1000);
    }

    destroyed() {
        clearInterval(this.setNum);
    }
}
</script>

<style scoped>

</style>