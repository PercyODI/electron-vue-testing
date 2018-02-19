<template>
<div id="app" class="width100 height100">
    <div v-if="showStart" class="width100 height100">
        <StartScreen @showViewScreen="showViewScreen" />
    </div>
    <div v-if="!showStart" class="width100 height100">
        <ViewScreen :sharedFiles="images"/>
    </div>
</div>

</template>

<script lang="ts">
import { Component } from "vue";
import { Vue, Component as ComponentDecorator } from "vue-property-decorator";
import * as StartScreenFile from "./StartScreen.vue";
var StartScreen = StartScreenFile as Component<any>;
import * as ViewScreenFile from "./ViewScreen.vue";
var ViewScreen = ViewScreenFile as Component<any>;

import {SharedFile} from "../models/SharedFiles";

@ComponentDecorator({
  name: "App",
  components: {
    ViewScreen,
    StartScreen
  }
})
export default class App extends Vue {
  showStart: boolean = true;
  images: SharedFile[] = [];

  toggleShowStart() {
    this.showStart = !this.showStart;
  }

  showViewScreen(sharedFiles: SharedFile[]) {
    if (sharedFiles !== undefined && Array.isArray(sharedFiles) && sharedFiles.length > 0) {
      this.images = sharedFiles;
      this.toggleShowStart();
    }
  }
}
</script>

<style lang="scss">
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

.flex-justify-between {
  justify-content: space-between;
}

.flex-align-center {
  align-items: center;
}

.dev-border {
  border: 1px solid black;
}
</style>
