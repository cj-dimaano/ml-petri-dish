/*******************************************************************************
@file `absorb.system.ts`
  Created July 20, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import * as MathEx from "./math-ex"
import { GameComponentSystem } from "./game-system";
import {
  GameComponentKinds,
  AbsorbComponent,
  ParticleComponent,
  SensorComponent,
  DecayComponent,
  EnergyComponent
} from "./components";
import { GameEntity } from "./game-entity";
import { LongevityProteinEntity } from "./longevity-protein.entity";
import { BubbleEntity } from "./bubble.entity";

export class AbsorbSystem extends GameComponentSystem {
  constructor() {
    super(GameComponentKinds.Absorb)
  }
  protected createComponent(host: GameEntity): AbsorbComponent {
    return new AbsorbComponent(host)
  }
  update(dt: number): void {
    this.components.forEach(
      (value) => {
        const host = value.host
        const absorb = <AbsorbComponent>value
        const particle = <ParticleComponent>host.components
          .get(GameComponentKinds.Particle)!
        const sensor = <SensorComponent>host.components
          .get(GameComponentKinds.Sensor)!
        const decay = <DecayComponent>host.components
          .get(GameComponentKinds.Decay)
        const energy = <EnergyComponent>host.components
          .get(GameComponentKinds.Energy)
        const r2 = particle.radius * particle.radius
        sensor.detected.forEach(
          (target) => {
            if (target.isDisposed)
              return
            const targetParticle = <ParticleComponent>target.components
              .get(GameComponentKinds.Particle)!
            const v
              = MathEx.subtract(particle.position, targetParticle.position)
            const d = MathEx.dot(v, v)
            if (d > r2)
              return
            if (target instanceof LongevityProteinEntity) {
              const targetDecay = <DecayComponent>target.components
                .get(GameComponentKinds.Decay)!
              absorb.durabilityBonus
                += (2 * targetDecay.durability - targetDecay.lifespan)
              target.dispose()
              return
            }
            if (target instanceof BubbleEntity) {
              // @todo
              // use growth level of target to determine energy amount
              energy.fuel += 1
              target.dispose()
              return
            }
          }
        )
      }
    )
  }
}
