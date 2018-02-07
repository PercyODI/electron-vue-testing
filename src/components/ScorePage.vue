<template>
    <div v-bind:class="classObject">
        <img src="C:\test\1.png" alt="" v-bind:height="imgHeight">
    </div>
</template>

<script lang="ts">
export default {
    data: function() {
        return {
            imgHeight: "50px",
        }
    },
    props: {
        side: String,
        height: String
    },
    watch: {
        height: function(newVal, oldVal) {
            imgHeight = newVal;
        }
    },
    computed: {
        classObject: function(): any {
            return {
                "sp-left": this.side == "left",
                "sp-right": this.side == "right"
            };
        }
    }
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}

.sp-left {
  display: flex;
  justify-content: flex-end;
}
</style>
