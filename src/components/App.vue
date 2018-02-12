<template>
<div id="app" class="width100 height100">
    <div v-if="showStart" class="width100 height100">
        <StartScreen @showViewScreen="showViewScreen" />
    </div>
    <div v-if="!showStart" class="width100 height100">
        <ViewScreen :images="images"/>
    </div>
</div>

</template>

<script>
import StartScreen from "./StartScreen.vue";
import ViewScreen from "./ViewScreen.vue";

export default {
    components: {
        StartScreen, ViewScreen
    },
    data: function () {
        return {
            showStart: true,
            images: [],
        };
    },
    methods: {
        toggleShowStart() {
            this.showStart = !this.showStart;
        },
        showViewScreen(images) {
            console.log(images);
            if(images !== undefined && Array.isArray(images) && images.length > 0) {
                this.images = images;
                this.toggleShowStart();
            }
        }
    }
};

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
