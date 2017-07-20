/*******************************************************************************
@file `energy.system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>

@todo
  apply angular acceleration
  > angular acceleration affects linear velocity
*******************************************************************************/

import * as MathEx from "./math-ex"
import { GameComponentSystem } from "./game-system"
import { GameEntity } from "./game-entity"
import {
  GameComponentKinds,
  EnergyComponent,
  ParticleComponent
} from "./components"

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

        // Get the unit vector of the facing direction.
        const u = MathEx.rotate([1, 0], particle.angle)

        // Calculate acceleration.
        const accel = sec * energy.acceleration

        // Apply linear acceleration.
        if (energy.applyAcceleration && energy.fuel > 0) {
          MathEx._scale(u, accel)
          energy.fuel -= (sec < energy.fuel ? sec : energy.fuel)
        }

        // Apply angular acceleration.
        // > In reality, angular acceleration would cause the particle to rotate
        // > in the opposite direction. Here, we don't really care which
        // > direction rotation occurs.
        if (energy.applyAngularAcceleration && energy.fuel > 0) {
          MathEx._rotate(u, accel)
          energy.fuel -= (sec < energy.fuel ? sec : energy.fuel)
        }

        // Apply acceleration to velocity.
        MathEx._translate(particle.velocity, u)

        // Limit maximum velocity.
        const mag = MathEx.dot(particle.velocity, particle.velocity)
        if (mag > 900)
          MathEx._scale(particle.velocity, 900 / mag)
      }
    )
  }

  protected createComponent(host: GameEntity): EnergyComponent {
    const result = new EnergyComponent(host)
    return result
  }

}