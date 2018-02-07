<template>
    <div class="flex-col height100 width100">
        <div class="dev-border">Future Toolbar!</div>
        <div class="flex-row flex-grow height100">
            <div class="dev-border flex-col">
                <div class="dev-border flex-grow">
                    Tools?
                </div>
                <button>Back</button>
            </div>
            <ScorePage class="height100" ref="leftScorePage" side="left" :height="heightStr"/>
            <ScorePage class="height100" side="right" />
            <!-- <div class="dev-border flex-grow">Future Left Score Page</div>
            <div class="dev-border flex-grow">Future Right Score Page</div> -->
            <div class="dev-border flex-col">
                <div class="dev-border flex-grow">
                    Tools?
                </div>
                <button>Next</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import * as ScorePage from "./ScorePage.vue";
    
    export default {
        data: function() {
            return {
                heightStr: "0px"
            }
        },
        components: {
            ScorePage
        },
        methods: {
            matchHeight() {
                var heightString = this.$refs.leftScorePage.clientHeight + "px";
                this.heightStr = heightString;
            }
        }
    }
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
        flex-flow: column nowrap
    }

    .flex-row {
        display: flex;
        flex-flow: row nowrap;
    }

    .flex-grow {
        flex-grow: 1;
    }

    .dev-border {
        border: 1px solid black;
    }
</style>
