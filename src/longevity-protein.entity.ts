/*******************************************************************************
@file `longevity-protein.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import * as MathEx from "./math-ex"
import { GameEntity } from "./game-entity"
import { ParticleSystem } from "./particle.system"
import { DecaySystem } from "./decay.system"
import { DecayComponent, ParticleComponent, GameComponentKinds } from "./components"

export class LongevityProteinEntity extends GameEntity {
  constructor(particleSystem: ParticleSystem, decaySystem: DecaySystem) {
    super()
    const particle = <ParticleComponent>particleSystem.attachComponent(this)
    const decay = <DecayComponent>decaySystem.attachComponent(this)
    decay.durability *= 10
    particle.velocity[0] = 5 - 10 * Math.random()
    particle.velocity[1] = 5 - 10 * Math.random()
    particle.angularVelocity = 0.1 - 0.2 * Math.random()
  }
  draw(g: CanvasRenderingContext2D): void {
    const particle = <ParticleComponent>this.components
      .get(GameComponentKinds.Particle)!
    const p = MathEx.rotate([0, -3], particle.angle)
    const pi2_3 = 2 * Math.PI / 3
    g.fillStyle = "green"
    g.beginPath()
    let v = MathEx.translate(p, particle.position)
    g.moveTo(v[0], v[1])
    MathEx._rotate(p, pi2_3)
    v = MathEx.translate(p, particle.position)
    g.lineTo(v[0], v[1])
    MathEx._rotate(p, pi2_3)
    v = MathEx.translate(p, particle.position)
    g.lineTo(v[0], v[1])
    g.closePath()
    g.fill()
  }
}
