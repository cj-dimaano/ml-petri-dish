/*******************************************************************************
@file `index.ts`
  Created July 17, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { FiatSystem } from "./fiat.system"

let canvas: HTMLCanvasElement
let g: CanvasRenderingContext2D
let screenHeight: number
let screenWidth: number
let prevTimestamp: number

let fiatSystem: FiatSystem

function update(dt: number) {
  fiatSystem.update(dt)
}

function draw() {
  g.fillStyle = "white"
  g.fillRect(0, 0, screenWidth, screenHeight)
  fiatSystem.bubbles.forEach((value) => value.draw(g))
  fiatSystem.proteins.forEach((value) => value.draw(g))
  fiatSystem.bacteria.forEach((value) => value.draw(g))
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
  fiatSystem = new FiatSystem()
  fiatSystem.particleSystem.screenHeight = screenHeight
  fiatSystem.particleSystem.screenWidth = screenWidth
  fiatSystem.sensorSystem.signalSystem = fiatSystem.signalSystem
  fiatSystem.replicateSystem.fiatSystem = fiatSystem
  window.requestAnimationFrame(updateAndDraw)
}

window.addEventListener("load", init)
