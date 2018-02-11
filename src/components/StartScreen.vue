<template>
  <div class="flex-col height100 flex-Justify-center">
    <div class="flex-row flex-space-around fiftyHeight">
      <div class="dev-border thirtyWidth" @click="openDirectory()">Open Score</div>
      <div class="dev-border thirtyWidth">Recent Scores</div>
      <div class="dev-border thirtyWidth">Convert from PDF</div>  
    </div>
    <div class="loader" v-if="numToLoad > 0">Loaded {{numLoaded}} of {{numToLoad}}</div>
  </div>
</template>

<script>
import { remote } from "electron";
import fs from "fs";
import path from "path";
import _ from "lodash";
export default {
  data: function() {
    return {
      numLoaded: 0,
      numToLoad: 0,
      imagesToEmit: [],
    };
  },
  methods: {
    showTheViewScreen() {
      this.$emit("showViewScreen", this.imagesToEmit);
    },
    checkIfFinished() {
      if (this.numLoaded >= this.numToLoad) {
        this.showTheViewScreen();
      }
    },
    openDirectory() {
      remote.dialog.showOpenDialog(
        {
          properties: ["openDirectory"],
          filters: [
            {
              name: "images",
              extensions: ["png", "jpg", "gif"]
            }
          ]
        },
        directoryPath => {
          console.log(directoryPath);
          let re = new RegExp(/^.*?0*(\d+)\.\w+$/);
          let newFiles = fs.readdirSync(directoryPath[0]);
          this.numToLoad = newFiles.length;
          let newImages = newFiles.map(fileName => {
            var img = new Image();
            img.src = path.join(directoryPath[0], fileName);
            img.addEventListener("load", () => {
              this.numLoaded++;
              this.checkIfFinished();
            });
            return img;
          });

          let images = _.sortBy(newImages, [
            image => {
              let it = re.exec(image.src)[1];
              return parseInt(it);
            }
          ]);
          this.imagesToEmit = images;
        }
      );
    }
  }
};
</script>

<style scoped>
.flex-space-around {
  justify-content: space-around;
}
.thirtyWidth {
  width: 30%;
}
.fiftyHeight {
  height: 50%;
}
.loader {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
