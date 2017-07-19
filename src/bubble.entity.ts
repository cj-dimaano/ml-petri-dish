/*******************************************************************************
@file `bubble.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameEntity } from "./game-entity"
import { ParticleSystem } from "./particle.system"
import { GameComponentKinds, ParticleComponent } from "./components"

export class BubbleEntity extends GameEntity {
  constructor(particleSystem: ParticleSystem) {
    super()
    particleSystem.attachComponent(this)
  }
  draw(g: CanvasRenderingContext2D): void {
    console.assert(this.components.has(GameComponentKinds.Particle),
      "error: missing particle component in bubble enttiy")
    const particle = <ParticleComponent>this.components
      .get(GameComponentKinds.Particle)!
    g.strokeStyle = "blue"
    g.lineWidth = 1
    g.beginPath()
    g.arc(particle.position[0], particle.position[1], 2, 0, 2 * Math.PI)
    g.stroke()
  }
}
