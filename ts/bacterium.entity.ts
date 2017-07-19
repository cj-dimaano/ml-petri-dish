/*******************************************************************************
@file `bacterium.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameEntity } from "game-entity"

export class BacteriumEntity extends GameEntity {
  private constructor() { super() }
  draw(g: CanvasRenderingContext2D): void { }
  static create(/* @todo require systems */): BacteriumEntity {
    const result = new BacteriumEntity()
    // @todo
    //   add components
    return result
  }
}
