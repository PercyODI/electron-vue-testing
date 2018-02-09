<template>
    <div class="flex-col height100 width100">
        <div class="dev-border">Future Toolbar!</div>
        <div class="flex-row flex-grow">
            <div class="dev-border flex-col" ref="toolbarLeft">
                <div class="dev-border flex-grow">
                    Tools?
                </div>
                <button v-on:click="backTwoPages()">Back</button>
            </div>
            <div class="flex-grow flex-row flex-Justify-center width100">
                <ScorePage class="" side="left" :height="spHeight" :width="spWidth" :imgPath="files[currentLeftFile]" />
                <ScorePage class="" side="right" :height="spHeight" :width="spWidth" :imgPath="files[currentRightFile]" />
            </div>
            <div class="dev-border flex-col" ref="toolbarRight">
                <div class="dev-border flex-grow">
                    Tools?
                </div>
                <button v-on:click="nextTwoPages()">Next</button>
            </div>
        </div>
    </div>
</template>

<script>
import * as ScorePage from "./ScorePage.vue";
import { remote } from "electron";
import fs from "fs";
import path from "path";

export default {
  data: function() {
    return {
      spHeight: 0,
      spWidth: 0,
      files: [],
      currentLeftFile: 0,
      currentRightFile: 1
    };
  },
  components: {
    ScorePage
  },
  methods: {
    setSize() {
      this.spHeight = this.$refs.toolbarLeft.clientHeight;
      this.spWidth = (window.innerWidth - this.$refs.toolbarLeft.clientWidth - this.$refs.toolbarRight.clientWidth) / 2;
    },
    backTwoPages() {
        if (this.currentLeftFile > 0) {
            this.currentLeftFile -= 2;
            this.currentRightFile -= 2;
        }
    },
    nextTwoPages() {
        if(this.currentRightFile < this.files.length){
            this.currentLeftFile += 2;
            this.currentRightFile += 2;
        }
    }
  },
  created: function() {
      remote.dialog.showOpenDialog({
          properties: [
              "openDirectory"
          ],
          filters: [
              { name: "images", extensions: ["png", "jpg", "gif"]}, 
          ],
      }, (directoryPath) => {
          console.log(directoryPath);
          let newFiles = fs.readdirSync(directoryPath[0]);
          newFiles = newFiles.map((fileName) => path.join(directoryPath[0], fileName));
          this.files = this.files.concat(newFiles);
      })
  },
  mounted: function() {
    this.setSize();
    window.addEventListener("resize", this.setSize);
  }
};
</script>

<style lang="scss" scoped>
.height100 {
  height: 100%;
  max-height: 100%;
}

.width100 {
  width: 100%;
  max-width: 100%;
}

.flex-col {
  display: flex;
  flex-flow: column nowrap;
}

.flex-row {
  display: flex;
  flex-flow: row nowrap;
}

.flex-grow {
  flex-grow: 1;
}

.flex-Justify-center {
    justify-content: center;
}

.dev-border {
  border: 1px solid black;
}
</style>
