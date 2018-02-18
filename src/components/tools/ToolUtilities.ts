import * as SVG from "svg.js"

export interface Point {
    x: number,
    y: number
}

export function invertScale(scale: number): number {
    return 1 / scale
}

export function invertScaleOnPoint(point: Point, scale: number): Point {
    return {
        x: point.x * invertScale(scale),
        y: point.y * invertScale(scale)
    }
}

export function clickedPoint(evt: MouseEvent | TouchEvent, svgjs: SVG.Doc): Point {
    let clientX = 0
    let clientY = 0
    if (evt instanceof MouseEvent) {
        clientX = evt.clientX
        clientY = evt.clientY
    } else {
        clientX = evt.touches[0].clientX
        clientY = evt.touches[0].clientY
    }

    let clickedX = clientX - svgjs.parent().offsetLeft
    let clickedY = clientY - svgjs.parent().offsetTop
    return {
        x: clickedX,
        y: clickedY
    }
}