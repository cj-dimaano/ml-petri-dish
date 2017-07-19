/*******************************************************************************
@file `particle.system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import * as MathEx from "math-ex"
import { GameSystem } from "game-system"
import { GameEntity } from "game-entity"
import {
  GameComponentKinds,
  ParticleComponent
} from "components"

export class ParticleSystem extends GameSystem {
  constructor(
    public readonly screenHeight: number,
    public readonly screenWidth: number
  ) { super(GameComponentKinds.Particle) }

  update(dt: number): void {
    // Get the delta time in seconds.
    const sec = dt / 1000

    // Update each component.
    this.components.forEach(
      (value) => {
        const particle = <ParticleComponent>value;
        const velocity = MathEx.scale(particle.velocity, sec)
        MathEx._translate(particle.position, velocity)
      }
    )
  }

  protected createComponent(host: GameEntity): ParticleComponent {
    const result = new ParticleComponent(host)
    result.position[0] = this.screenWidth * Math.random()
    result.position[1] = this.screenHeight * Math.random()
    return result
  }
}
