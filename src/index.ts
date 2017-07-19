/*******************************************************************************
@file `index.ts`
  Created July 17, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { BubbleEntity } from "bubble.entity"
import { ParticleSystem } from "particle.system"

let canvas: HTMLCanvasElement
let g: CanvasRenderingContext2D
let screenHeight: number
let screenWidth: number
let prevTimestamp: number

let particleSystem: ParticleSystem
let bubbles: BubbleEntity[] = []

function update(dt: number) {
}

function draw() {
  g.fillStyle = "white"
  g.fillRect(0, 0, screenWidth, screenHeight)
  for (const bubble of bubbles)
    bubble.draw(g)
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
  particleSystem = new ParticleSystem(screenHeight, screenWidth)
  for (let i = 0; i < 50; i++)
    bubbles.push(new BubbleEntity(particleSystem))
  window.requestAnimationFrame(updateAndDraw)
}

window.addEventListener("load", init)
