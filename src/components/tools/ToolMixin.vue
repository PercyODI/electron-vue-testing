<template>
  
</template>

<script lang="ts">
import {Vue, Component, Prop } from "vue-property-decorator";
import SVG from "svg.js";

@Component({
  name: "ToolMixin"
})
export default class ToolMixin extends Vue {
  @Prop() svgs: SVG.Doc[];
}
</script>

<style>

</style>
