/*******************************************************************************
@file `index.ts`
  Created July 17, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

let canvas: HTMLCanvasElement
let g: CanvasRenderingContext2D
let screenHeight: number
let screenWidth: number
let prevTimestamp: number

function update(dt: number) {
}

function draw() {
  g.fillStyle = "white"
  g.fillRect(0, 0, screenWidth, screenHeight)
}

function updateAndDraw(timestamp: number) {
  const dt = timestamp - (prevTimestamp === undefined
    ? timestamp
    : prevTimestamp)
  prevTimestamp = timestamp
  update(dt)
  draw()
  window.requestAnimationFrame(updateAndDraw)
}

function init() {
  canvas = <HTMLCanvasElement>document.getElementById("canvas")
  g = <CanvasRenderingContext2D>canvas.getContext("2d")
  screenHeight = canvas.clientHeight
  screenWidth = canvas.clientWidth
  window.requestAnimationFrame(updateAndDraw)
}

window.addEventListener("load", init)
