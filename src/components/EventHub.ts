import {
    Vue,
    Component as ComponentDecorator,
} from "vue-property-decorator"
import * as SVG from "svg.js"

@ComponentDecorator({
    name: "EventHub"
})
export class EventHub extends Vue {
    updateSvgName = "updateSvg"
    updateSvg(svg: SVG.Doc) {
        this.$emit("updateSvg", svg)
    }
    onUpdateSvgListener(func: (svg: SVG.Doc) => void) {
        this.$on(this.updateSvgName, func)
    }
    offUpdateSvgListener(func: Function) {
        this.$off(this.updateSvgName, func)
    }

    saveSvgName = "saveSvg"
    saveSvg() {
        this.$emit("saveSvg")
    }
    onSaveSvgListener(func: () => void) {
        this.$on(this.saveSvgName, func)
    }
    offSaveSvgListener(func: Function) {
        this.$off(this.saveSvgName, func)
    }

    addSvgName = "addSvg"
    addSvg(svg: SVG.Doc) {
        this.$emit("addSvg", svg)
    }
    onAddSvgListener(func: (svg: SVG.Doc) => void) {
        this.$on(this.addSvgName, func)
    }
    offAddSvgListener(func: Function) {
        this.$off(this.addSvgName, func)
    }
}
