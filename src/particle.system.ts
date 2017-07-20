/*******************************************************************************
@file `particle.system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import * as MathEx from "./math-ex"
import { GameComponentSystem } from "./game-system"
import { GameEntity } from "./game-entity"
import { GameComponentKinds, ParticleComponent } from "./components"

export class ParticleSystem extends GameComponentSystem {
  constructor(
    public readonly screenHeight: number,
    public readonly screenWidth: number
  ) { super(GameComponentKinds.Particle) }

  update(dt: number): void {
    const fnReflect = (
      x: number,
      min: number,
      max: number,
      v: MathEx.vec2,
      i: number): number => {
      if (x > max) {
        v[i] *= -1
        return x - max
      }
      if (0 > x) {
        v[i] *= -1
        return min - x
      }
      return x
    }
    // Delta time in seconds.
    const sec = dt / 1000

    // Update each component.
    this.components.forEach(
      (value) => {
        const particle = <ParticleComponent>value;
        const v = MathEx.scale(particle.velocity, sec)
        const p = particle.position
        MathEx._translate(p, v)
        p[0] = fnReflect(p[0], 0, this.screenWidth, particle.velocity, 0)
        p[1] = fnReflect(p[1], 0, this.screenHeight, particle.velocity, 1)
        particle.angle += particle.angularVelocity
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
