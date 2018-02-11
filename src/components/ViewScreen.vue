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
                <ScorePage class="" side="left" :height="spHeight" :width="spWidth" :img="images[currentLeftFile]" />
                <ScorePage class="" side="right" :height="spHeight" :width="spWidth" :img="images[currentRightFile]" />
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
import StartScreen from "./StartScreen.vue";

export default {
  data: function() {
    return {
      spHeight: 0,
      spWidth: 0,
      currentLeftFile: 0,
      currentRightFile: 1
    };
  },
  props: {
    images: Array
  },
  components: {
    ScorePage
  },

  methods: {
    setSize() {
      this.spHeight = this.$refs.toolbarLeft.clientHeight;

      this.spWidth =
        (window.innerWidth - this.$refs.toolbarLeft.clientWidth - this.$refs.toolbarRight.clientWidth) / 2;
    },

    backTwoPages() {
      if (this.currentLeftFile > 0) {
        this.currentLeftFile -= 2;

        this.currentRightFile -= 2;
      }
    },

    nextTwoPages() {
      if (this.currentRightFile < this.images.length - 1) {
        this.currentLeftFile += 2;

        this.currentRightFile += 2;
      }
    }
  },

  mounted: function() {
    this.setSize();
    window.addEventListener("resize", this.setSize);
    window.addEventListener("keydown", event => {
      console.log(event);

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
    });
  },

  destroyed: function() {
      window.removeEventListener("resize");
      window.removeEventListener("keydown");
  }
};
</script>

<style scoped>

</style>
