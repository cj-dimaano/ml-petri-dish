/*******************************************************************************
@file `signal.system.ts`
  Created July 20, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "./game-system";
import { GameEntity } from "./game-entity";
import { SignalComponent, GameComponentKinds } from "./components";

export class SignalSystem extends GameComponentSystem {
  constructor() { super(GameComponentKinds.Signal) }
  protected createComponent(host: GameEntity): SignalComponent {
    return new SignalComponent(host)
  }
  update(dt: number): void { }
}
