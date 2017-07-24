/*******************************************************************************
@file `replicate.system.ts`
  Created July 23, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameSystem } from "./game-system";
import { FiatSystem } from "./fiat.system";
import {
  GameComponentKinds,
  EnergyComponent,
  DecayComponent,
  AbsorbComponent,
  ParticleComponent,
  SignalComponent,
  SensorComponent,
  MLComponent
} from "./components";


export class ReplicateSystem extends GameSystem {
  update(dt: number): void {
    const sec = dt / 1000
    const bacteria = [...this.fiatSystem.bacteria]
    bacteria.forEach(
      (value) => {
        const decay = <DecayComponent>value.components
          .get(GameComponentKinds.Decay)
        const absorb = <AbsorbComponent>value.components
          .get(GameComponentKinds.Absorb)
        const energy = <EnergyComponent>value.components
          .get(GameComponentKinds.Energy)
        const fuel = energy.fuel
        const durability = decay.durability
        const durabilityBonus = absorb.durabilityBonus
        // At 10 fuel && bonusDurability === 2x durability, there is a 50%
        // probability of replication per second.
        if (Math.random() < sec / (1 + Math.pow(2, -(fuel - 10) / 2))
          && Math.random()
          < sec / (1 + Math.pow(2, -(durabilityBonus - 2 * durability) / 2))) {
          const particle = <ParticleComponent>value.components
            .get(GameComponentKinds.Particle)
          const signal = <SignalComponent>value.components
            .get(GameComponentKinds.Signal)
          const sensor = <SensorComponent>value.components
            .get(GameComponentKinds.Sensor)
          const ml = <MLComponent>value.components
            .get(GameComponentKinds.ML)
          const clone = this.fiatSystem.addBacterium()
          clone.components.forEach(
            (value, key) => {
              switch (key) {
                case GameComponentKinds.Decay: {
                  absorb.durabilityBonus -= (<DecayComponent>value).durability
                } break

                case GameComponentKinds.Energy: {
                  (<EnergyComponent>value).fuel = fuel / 2
                  energy.fuel = fuel / 2
                } break

                case GameComponentKinds.Particle: {
                  const position = (<ParticleComponent>value).position
                  position[0] = particle.position[0]
                  position[1] = particle.position[1]
                  // @todo
                  // collision mechanics
                } break

                case GameComponentKinds.ML: {
                  (<MLComponent>value).ann.copyWeights(ml.ann, 0.01)
                } break
              }
            }
          )
        }
      }
    )
  }
  fiatSystem: FiatSystem
}