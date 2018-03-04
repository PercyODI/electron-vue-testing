<template>
<div class="height100 width100">
    <div class="flex-col height100 flex-Justify-center">
        <div class="flex-row flex-space-around fiftyHeight">
            <div class="dev-border thirtyWidth" @click="openDirectory()">Open Score</div>
            <div class="dev-border thirtyWidth">Recent Scores</div>
            <div class="dev-border thirtyWidth" @click="convertPdf()">Convert from PDF</div>
        </div>
        <div class="loader" v-if="numToLoad > 0">Loaded {{numLoaded}} of {{numToLoad}}</div>

    </div>
    <canvas id="conversionCanvas"></canvas>
</div>

</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { remote } from "electron";
import * as fs from "fs-extra";
import * as path from "path";
import * as _ from "lodash";
import { isNullOrUndefined } from "util";
import { SharedFile } from "../models/SharedFiles";
import { PDFJSStatic, PDFRenderParams, PDFDocumentProxy } from "pdfjs-dist";
var PDFJS: PDFJSStatic = require("../../node_modules/pdfjs-dist/build/pdf.combined");

@Component({
  name: "StartScreen"
})
export default class StartScreen extends Vue {
  numLoaded: number = 0;
  numToLoad: number = 0;
  filesToEmit: SharedFile[] = [];
  allowedImageTypes = [".jpg", ".png", ".tiff", ".gif"];

  showTheViewScreen(filesToEmit: SharedFile[]) {
    this.$emit("showViewScreen", filesToEmit);
  }

  checkIfFinished() {
    if (this.numLoaded >= this.numToLoad) {
      this.showTheViewScreen(this.filesToEmit);
    }
  }
  openDirectory() {
    remote.dialog.showOpenDialog(
      {
        properties: ["openDirectory"]
      },
      directoryPath => {
        // console.log(directoryPath);
        const re = new RegExp(/^.*?0*(\d+)\.\w+$/);
        let foundImageFiles = fs.readdirSync(directoryPath[0]).filter(f => {
          let doesInclude = _.includes(this.allowedImageTypes, path.extname(f));
          // console.log(`${f} is found in ${this.allowedImageTypes.reduce((acc, next) => { return acc + " " + next})}: ${doesInclude}`);
          return doesInclude;
        });
        // console.log(foundImageFiles);
        // let foundSvgFiles = fs
        //   .readdirSync(directoryPath[0])
        //   .filter(f => path.extname(f).includes(".svg"));
        this.numToLoad = foundImageFiles.length;
        let files: SharedFile[] = foundImageFiles.map(fileName => {
          var filePath = path.join(directoryPath[0], fileName);
          var img = new Image();
          img.addEventListener("load", () => {
            this.numLoaded++;
            this.checkIfFinished();
          });
          img.src = filePath;

          let filePathParsed = path.parse(filePath);
          let svgFileName = path.join(
            filePathParsed.dir,
            filePathParsed.name + ".svg"
          );
          var sharedFile: SharedFile = {
            image: img,
            baseFileName: path.join(filePathParsed.dir, filePathParsed.name)
          };
          if (fs.existsSync(svgFileName)) {
            let svgString = fs.readFileSync(svgFileName, "utf8");
            sharedFile.svg = svgString;
            // console.log(svgString);
          }

          return sharedFile;
        });

        this.filesToEmit = _.sortBy(files, file => {
          let it = re.exec(file.image.src)![1];
          return parseInt(it);
        });
      }
    );
  }

  convertPdf() {
    // PDFJS.disableWorker = false;
    // window.PDFJS.workerSrc = "./pdf.worker.js";
    remote.dialog.showOpenDialog(
      {
        filters: [{ name: "PDFs", extensions: ["pdf"] }]
      },
      filenames => {
        console.log(PDFJS);
        console.log("Loading " + filenames[0]);
        // console.log(pdfjsLib.PDFJS);
        PDFJS.getDocument(filenames[0]).then(pdf => {
          remote.dialog.showOpenDialog(
            {
              title: "Save images to...",
              properties: ["openDirectory"]
            },
            (directoryPath) => {
              let directoryToSaveTo = directoryPath[0];
              this.savePageToFile(pdf, 1, directoryToSaveTo);
            }
          );
          
        });
      }
    );
  }

  savePageToFile(pdf: PDFDocumentProxy, pageNum: number, folderPath: string) {
    if (pageNum > pdf.numPages) {
      return;
    }
    pdf.getPage(pageNum).then(page => {
      var conversionCanvasElem = document.getElementById(
        "conversionCanvas"
      ) as HTMLCanvasElement;
      var conversionCanvasContext = conversionCanvasElem.getContext("2d");
      if (isNullOrUndefined(conversionCanvasContext)) {
        console.log("Failed to find conversion canvas!");
        return;
      }
      console.log("Processing page " + page.pageNumber);

      var scale = 1;
      var viewport = page.getViewport(scale);
      conversionCanvasElem.height = viewport.height;
      conversionCanvasElem.width = viewport.width;
      var renderContext: PDFRenderParams = {
        canvasContext: conversionCanvasContext,
        viewport
      };

      page.render(renderContext).then(() => {
        const canvasDataStr = conversionCanvasElem.toDataURL();
        const data = canvasDataStr.replace(/^data:image\/png;base64,/, "");
        console.log(`Creating ${folderPath}\\${pageNum}.png`);
        fs.mkdirsSync(folderPath);
        fs.writeFileSync(`${folderPath}\\${pageNum}.png`, data, "base64");
        this.savePageToFile(pdf, pageNum + 1, folderPath);
      });
    });
  }
}
</script>

<style scoped>
#conversionCanvas {
  display: none;
}

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
