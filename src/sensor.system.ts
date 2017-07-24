/*******************************************************************************
@file `sensor.system.ts`
  Created July 20, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import * as MathEx from "./math-ex"
import { GameComponentSystem } from "./game-system";
import { SignalSystem } from "./signal.system";
import {
  GameComponentKinds,
  SensorComponent,
  ParticleComponent,
  SignalComponent
} from "./components";
import { GameEntity } from "./game-entity";

export class SensorSystem extends GameComponentSystem {
  constructor() {
    super(GameComponentKinds.Sensor)
  }
  public signalSystem: SignalSystem
  protected createComponent(host: GameEntity): SensorComponent {
    return new SensorComponent(host)
  }
  update(dt: number): void {
    this.components.forEach(
      (value) => {
        const host = value.host
        const sensor = <SensorComponent>value
        const particle
          = <ParticleComponent>host.components.get(GameComponentKinds.Particle)
        const r2 = particle.radius * particle.radius

        const detected: GameEntity[] = []
        const distances: number[] = []
        const indices: number[] = []
        this.signalSystem.components.forEach(
          (signalValue) => {
            const signalHost = signalValue.host
            if (signalHost !== host) {
              const signal = <SignalComponent>signalValue
              const signalPartical = <ParticleComponent>signalHost.components
                .get(GameComponentKinds.Particle)
              const sr2 = signal.radius * signal.radius
              const v
                = MathEx.subtract(particle.position, signalPartical.position)
              const d = MathEx.dot(v, v)
              if (d - r2 - sr2 < 0) {
                detected.push(signalHost)
                distances.push(d)
                indices.push(distances.length - 1)
                for (let i = 1; i < indices.length; i++) {
                  let val = indices[i]
                  let j = i
                  while (j > 0 && distances[val] < distances[indices[j - 1]]) {
                    indices[j] = indices[j - 1]
                    j--
                  }
                  indices[j] = val
                }
              }
            }
          }
        )
        sensor.detected = []
        indices.forEach((value) => sensor.detected.push(detected[value]))
      }
    )
  }
}
