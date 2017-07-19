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
import { GameSystem } from "game-system"
import { GameEntity } from "game-entity"
import {
  GameComponentKinds,
  EnergyComponent,
  ParticleComponent
} from "components"

export class EnergySystem extends GameSystem {
  constructor() { super(GameComponentKinds.Energy) }

  update(dt: number): void {
    // Get the delta time in seconds.
    const sec = dt / 1000

    // Update each component.
    this.components.forEach(
      (value) => {
        // Apply acceleration to the velocity.
        const energyComponent = <EnergyComponent>value
        if (energyComponent.applyAcceleration) {
          console.assert(value.host.components.has(GameComponentKinds.Particle),
            "error: energy component host entity missing particle component")
          const particleComponent = <ParticleComponent>value.host.components
            .get(GameComponentKinds.Energy)!
          const u = MathEx.normalize(particleComponent.velocity)
          MathEx._scale(u, sec * energyComponent.acceleration)
          MathEx._translate(particleComponent.velocity, u)
        }
      }
    )
  }

  protected createComponent(host: GameEntity): EnergyComponent {
    const result = new EnergyComponent(host)
    return result
  }

}