/*******************************************************************************
@file `q-state.ts`
  Created July 23, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import {
  EnergyComponent,
  ParticleComponent,
  GameComponentKinds,
  SignalComponent
} from "./components";
import { GameEntity } from "./game-entity";
import { subtract, _rotate, dot } from "./math-ex";

export const FEATURE_COUNT = 26

/**
 * @summary
 *   Represents an instance of the observable environment state.
 * 
 * @description
 *   Features include the host fuel, linear acceleration, angular acceleration,
 *   and relative positions as well as signal signatures of detected entities.
 * 
 *   Fuel amount and position coordinates are rounded to the nearest number.
 * 
 *   Other ideas include using distance and angle relative to the host facing
 *   direction in place of positions.
 */
export class QState {
  constructor(
    energy: EnergyComponent,
    particle: ParticleComponent,
    detected: Set<GameEntity>
  ) {
    this.features.push(
      Math.round(energy.fuel),
      energy.acceleration,
      energy.angularAcceleration,
      particle.angularVelocity,
      dot(particle.velocity, particle.velocity)
    )
    detected.forEach(
      (value) => {
        if (this.features.length === FEATURE_COUNT)
          return
        const dParticle = <ParticleComponent>value.components
          .get(GameComponentKinds.Particle)!
        const dSignal = <SignalComponent>value.components
          .get(GameComponentKinds.Signal)!
        const p = subtract(dParticle.position, particle.position)
        _rotate(p, -particle.angle)
        this.features.push(
          dSignal.signature,
          Math.round(p[0]),
          Math.round(p[1])
        )
      }
    )
    while (this.features.length < FEATURE_COUNT)
      this.features.push(0)
  }
  readonly features: number[] = []
  compare(other: QState): number {
    let result = 0
    let i = 0
    while (result === 0 && i < this.features.length) {
      result = this.features[i] - other.features[i]
      i++
    }
    return result
  }
}
