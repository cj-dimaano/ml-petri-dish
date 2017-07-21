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
  constructor(private readonly signalSystem: SignalSystem) {
    super(GameComponentKinds.Sensor)
  }
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

        sensor.detected.clear()
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
              if (d - r2 - sr2 < 0)
                sensor.detected.add(signalHost)
            }
          }
        )
      }
    )
  }
}
