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
        let accel = sec * energy.acceleration

        // Apply linear acceleration.
        accel = energy.fuel < accel ? energy.fuel : accel
        MathEx._scale(u, accel * 100)
        energy.fuel -= accel
        MathEx._translate(particle.velocity, u)

        // Apply angular acceleration.
        // > In reality, angular acceleration would cause the particle to rotate
        // > in the opposite direction. Here, we don't really care which
        // > direction rotation occurs.
        accel = sec * energy.angularAcceleration
        accel = energy.fuel < accel ? energy.fuel : accel
        particle.angularVelocity += accel
        energy.fuel -= Math.abs(accel)

        // Limit maximum velocity.
        const mag = MathEx.magnitude(particle.velocity)
        if (mag > 30)
          MathEx._scale(particle.velocity, 30 / mag)
        particle.angularVelocity
          = Math.min(particle.angularVelocity, Math.PI)
      }
    )
  }

  protected createComponent(host: GameEntity): EnergyComponent {
    return new EnergyComponent(host)
  }

}