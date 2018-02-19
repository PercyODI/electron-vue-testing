<template>
    <div class="flex-col height100 width100">
        <!-- <div class="dev-border">Future Toolbar!</div> -->
        <div class="flex-row flex-grow">
            <div class="dev-border flex-col flex-justify-between width145" ref="toolbarLeft">
                <LeftToolBar />
                <button v-on:click="backTwoPages()" class="pageButtonSize">Back</button>
            </div>
            <div class="flex-grow flex-row flex-Justify-center width100">
                <ScorePage class="" :height="spHeight" :width="spWidth" :files="sharedFiles[currentLeftFile]" />
                <ScorePage class="" :height="spHeight" :width="spWidth" :files="sharedFiles[currentRightFile]" />
            </div>
            <div class="dev-border flex-col width145" ref="toolbarRight">
                <div class="dev-border flex-grow">
                    Tools?
                </div>
                <button v-on:click="nextTwoPages()" class="pageButtonSize">Next</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component as vueComp } from "vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as scorePageFile from "./ScorePage.vue";
import * as leftToolBarFile from "./LeftToolBar.vue";
import { SharedFile } from "../models/SharedFiles";

var LeftToolBar = leftToolBarFile as vueComp<any, any, any, any>;
var ScorePage = scorePageFile as vueComp<any, any, any, any>;

@Component({
  components: {
    LeftToolBar,
    ScorePage
  },
  name: "ViewScreen"
})
export default class ViewScreen extends Vue {
  spHeight = 0;
  spWidth = 0;
  currentLeftFile = 0;
  currentRightFile = 1;
  
  @Prop() sharedFiles: SharedFile[];

  $refs: {
    toolbarLeft: HTMLElement,
    toolbarRight: HTMLElement
  }

  setSize() {
    this.spHeight = this.$refs.toolbarLeft.clientHeight;

    this.spWidth =
      (window.innerWidth -
        this.$refs.toolbarLeft.clientWidth -
        this.$refs.toolbarRight.clientWidth) /
      2;
  }

  backTwoPages() {
    if (this.currentLeftFile > 0) {
      this.currentLeftFile -= 2;

      this.currentRightFile -= 2;
    }
  }

  nextTwoPages() {
    if (this.currentRightFile < this.sharedFiles.length - 1) {
      this.currentLeftFile += 2;

      this.currentRightFile += 2;
    }
  }

  setKeyDownEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
        this.nextTwoPages();
        break;
      case "ArrowLeft":
        this.backTwoPages();
        break;
      default:
        break;
    }
  }

  mounted() {
    this.setSize();
    window.addEventListener("resize", this.setSize);
    window.addEventListener("keydown", this.setKeyDownEvent);
  }

  destroyed() {
    window.removeEventListener("resize", this.setSize);
    window.removeEventListener("keydown", this.setKeyDownEvent);
  }
}
</script>

<style scoped>
.width145 {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

.pageButtonSize {
  height: 20%;
}
</style>
