/*******************************************************************************
@file `game-system.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import {
  GameComponent,
  GameComponentKinds
} from "./components"
import { GameEntity } from "./game-entity"

/**
 * @summary
 *   Represents a discrete game mechanic and provides common functionality
 *   shared among all game systems.
 * 
 * @description
 *   Game systems are intended to be singleton objects.
 */
export abstract class GameSystem {
  protected constructor() { }
  /**
   * @summary
   *   Updates the components of the system.
   *
   * @param dt
   *   The change in time since the previous update measured in miliseconds.
   */
  abstract update(dt: number): void
}

/**
 * @summary
 *   Extends the `GameSystem` for systems dealing with particular kinds of
 *   components.
 */
export abstract class GameComponentSystem extends GameSystem {
  /**
   * @summary
   *   Constructs a game system.
   *
   * @param kind
   *   The specific kind of component associated with this particular system.
   */
  protected constructor(
    public readonly kind: GameComponentKinds
  ) { super() }

  /**
   * @summary
   *   The set of components belonging to this particular system.
   */
  components: GameComponent[] = []

  /**
   * @summary
   *   Creates a new component for this particular system.
   * 
   * @param host
   *   The entity to be attached by the created component.
   */
  protected abstract createComponent(host: GameEntity): GameComponent

  /**
   * @summary
   *   Attaches a component to the given entity.
   *
   * @param host
   *   The entity to be attached by the created component.
   */
  attachComponent(host: GameEntity): GameComponent {
    console.assert(this.components
      .find(value =>
        value.kind === this.kind && value.host === host) === undefined,
      `error: entity already has component ${this.kind}`)
    this.components.push(this.createComponent(host))
    host.systems.add(this)
    return this.components[this.components.length - 1]
  }

  /**
   * @summary
   *   Detaches a component from the given entity.
   *
   * @param host
   *   The entity with which to remove the attached component.
   */
  detachComponent(host: GameEntity): void {
    this.components = this.components
      .filter(value => value.kind !== this.kind || value.host !== host)
    host.systems.delete(this)
  }
}