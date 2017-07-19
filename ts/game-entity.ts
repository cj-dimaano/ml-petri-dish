/*******************************************************************************
@file `game-entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentKinds, GameComponent } from "components"

/**
 * @summary
 *   Represents a game entity.
 */
export abstract class GameEntity {
  /**
   * @summary
   *   Constructs a game entity.
   */
  protected constructor() { }

  /**
   * @summary
   *   The set of components attached to this entity.
   */
  readonly components = new Map<GameComponentKinds, GameComponent>()

  /**
   * @summary
   *   Draws the entity on the given rendering canvas.
   *
   * @param g
   *   The rendering context of the target canvas.
   */
  abstract draw(g: CanvasRenderingContext2D): void
}
