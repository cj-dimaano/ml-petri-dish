/*******************************************************************************
@file `bubble.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { PIx2 } from "./math-ex"
import { GameEntity } from "./game-entity"
import { ParticleSystem } from "./particle.system"
import { DecaySystem } from "./decay.system"
import {
  GameComponentKinds,
  ParticleComponent,
  SignalComponent
} from "./components"
import { SignalSystem } from "./signal.system";

export class BubbleEntity extends GameEntity {
  constructor(
    particleSystem: ParticleSystem,
    decaySystem: DecaySystem,
    signalSystem: SignalSystem
  ) {
    super()
    const particle = <ParticleComponent>particleSystem.attachComponent(this)
    decaySystem.attachComponent(this)
    const signal = <SignalComponent>signalSystem.attachComponent(this)
    signal.signature = 1 / 2
    signal.radius = 6
    particle.radius = 2
    particle.padding = 1
  }
  draw(g: CanvasRenderingContext2D): void {
    console.assert(this.components.has(GameComponentKinds.Particle),
      "error: missing particle component in bubble enttiy")
    const particle = <ParticleComponent>this.components
      .get(GameComponentKinds.Particle)!
    g.strokeStyle = "blue"
    g.lineWidth = 1
    g.beginPath()
    g.arc(particle.position[0], particle.position[1], particle.radius, 0, PIx2)
    g.stroke()
  }
}
