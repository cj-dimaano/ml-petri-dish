/*******************************************************************************
@file `energy.system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>

@todo
  apply angular acceleration
  > angular acceleration affects linear velocity
*******************************************************************************/

import * as MathEx from "math-ex"
import { GameComponentSystem } from "game-system"
import { GameEntity } from "game-entity"
import {
  GameComponentKinds,
  EnergyComponent,
  ParticleComponent
} from "components"

export class EnergySystem extends GameComponentSystem {
  constructor() { super(GameComponentKinds.Energy) }

  update(dt: number): void {
    // Get the delta time in seconds.
    const sec = dt / 1000

    // Update each component.
    this.components.forEach(
      (value) => {
        // Assert the type of the current value as an `EnergyComponent`.
        const energy = <EnergyComponent>value

        // Get the particle component from the host entity.
        console.assert(value.host.components.has(GameComponentKinds.Particle),
          "error: energy component host entity missing particle component")
        const particle = <ParticleComponent>value.host.components
          .get(GameComponentKinds.Particle)!

        // Get the normalized velocity vector of the particle.
        const u = MathEx.normalize(particle.velocity)

        // Calculate acceleration.
        const accel = sec * energy.acceleration

        // Apply linear acceleration.
        if (energy.applyAcceleration)
          MathEx._scale(u, accel)

        // Apply angular acceleration.
        // > In reality, angular acceleration would cause the particle to rotate
        // > in the opposite direction. Here, we don't really care which
        // > direction rotation occurs.
        if (energy.applyAngularAcceleration)
          MathEx._rotate(u, accel)

        // Apply acceleration to velocity.
        MathEx._translate(particle.velocity, u)
      }
    )
  }

  protected createComponent(host: GameEntity): EnergyComponent {
    const result = new EnergyComponent(host)
    return result
  }

}