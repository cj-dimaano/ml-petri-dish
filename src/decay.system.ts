/*******************************************************************************
@file `decay.system.ts`
  Created July 19, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "./game-system";
import { GameEntity } from "./game-entity";
import {
  DecayComponent,
  GameComponentKinds,
  AbsorbComponent
} from "./components";

export class DecaySystem extends GameComponentSystem {
  constructor() { super(GameComponentKinds.Decay) }
  protected createComponent(host: GameEntity): DecayComponent {
    return new DecayComponent(host)
  }
  update(dt: number): void {
    this.components.forEach(
      (value) => {
        const decay = <DecayComponent>value
        let durability = decay.durability
        if (decay.host.components.has(GameComponentKinds.Absorb)) {
          const absorb = <AbsorbComponent>decay.host.components
            .get(GameComponentKinds.Absorb)!
          absorb.durabilityBonus = Math.max(absorb.durabilityBonus - dt, 0)
          durability += absorb.durabilityBonus
        }
        decay.lifespan += dt
        if (Math.random() < decay.lifespan
          / (durability + decay.lifespan)
          / durability)
          decay.host.dispose()
      }
    )
  }
}