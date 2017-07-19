/*******************************************************************************
@file `growth.system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "game-system"
import { GameEntity } from "game-entity"
import { GameComponentKinds, GrowthComponent } from "components"

export class GrowthSystem extends GameComponentSystem {
  constructor() { super(GameComponentKinds.Growth) }
  update(dt: number): void { }
  protected createComponent(host: GameEntity): GrowthComponent {
    const result = new GrowthComponent(host)
    return result
  }

}
