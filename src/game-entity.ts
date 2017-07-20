/*******************************************************************************
@file `game-entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "./game-system"
import { GameComponentKinds, GameComponent } from "./components"

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
   *   Determines whether or not the entity has been disposed.
   */
  private _isDisposed: boolean = false

  /**
   * @summary
   *   The set of components attached to this entity.
   */
  readonly components = new Map<GameComponentKinds, GameComponent>()

  /**
   * @summary
   *   The set of game systems to which this entity belongs.
   */
  readonly systems = new Set<GameComponentSystem>()

  /**
   * @summary
   *   Gets whether or not the entity has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  /**
   * @summary
   *   Draws the entity on the given rendering canvas.
   *
   * @param g
   *   The rendering context of the target canvas.
   */
  abstract draw(g: CanvasRenderingContext2D): void

  /**
   * @summary
   *   Disposes the entity.
   */
  dispose(): void {
    this._isDisposed = true
    this.systems.forEach((value) => value.detachComponent(this))
  }
}
