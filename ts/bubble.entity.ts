/*******************************************************************************
@file `bubble.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameEntity } from "game-entity"

export class BubbleEntity extends GameEntity {
  private constructor() { super() }
  static create(/* @todo require systems */): BubbleEntity {
    const result = new BubbleEntity()
    // @todo
    //   add components
    return result
  }
  draw(g: CanvasRenderingContext2D): void { }
}
