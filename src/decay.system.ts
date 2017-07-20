/*******************************************************************************
@file `decay.system.ts`
  Created July 19, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "./game-system";
import { GameEntity } from "./game-entity";
import { DecayComponent, GameComponentKinds } from "./components";

export class DecaySystem extends GameComponentSystem {
  constructor() { super(GameComponentKinds.Decay) }
  protected createComponent(host: GameEntity): DecayComponent {
    return new DecayComponent(host)
  }
  update(dt: number): void {
    this.components.forEach(
      (value) => {
        const decay = <DecayComponent>value
        if (Math.random() < decay.calculateProbability(dt))
          decay.host.dispose()
      }
    )
  }
}