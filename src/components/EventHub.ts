import {
    Vue,
    Component as ComponentDecorator,
    Emit
} from "vue-property-decorator"
import * as SVG from "svg.js"

@ComponentDecorator({
    name: "EventHub"
})
export class EventHub extends Vue {
    updateSvg(svg: SVG.Doc) {
        this.$emit("updateSvg", svg)
    }
}
