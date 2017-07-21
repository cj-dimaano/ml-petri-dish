/*******************************************************************************
@file `components.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { vec2 } from "./math-ex"
import { GameEntity } from "./game-entity"

/**
 * @summary
 *   Registered kinds of game components.
 * 
 * @description
 *   In addition to extending the `GameComponent` class, a game component must
 *   add its kind to the set of values in order to be considered valid.
 */
export enum GameComponentKinds {
  Particle,
  Growth,
  Decay,
  Energy,
  Replicate,
  Signal,
  Sensor,
}

/**
 * @summary
 *   Represents a game component.
 * 
 * @description
 *   Game components provide attributes and functionality to game entities. The
 *   attributes provided by a game component are updated by a corresponding game
 *   system.
 *
 *   As an invariant, classes that extend the `GameComponent` class must only
 *   define a single constructor that takes a single parameter for its host.
 *   Each game component kind must have a corresponding game system. Property
 *   initialization for computed properties of game components must occur in the
 *   `createComponent` method of the game system object, and only game system
 *   objects are allowed to create new instances of components. Components that
 *   are created outside of a game system object will result in undefined
 *   behavior.
 */
export class GameComponent {
  /**
   * @summary
   *   Constructs a game component.
   *
   * @param kind
   *   The kind of this particular component.
   * 
   * @param host
   *   The entity to which this component is attached.
   */
  protected constructor(
    public readonly kind: GameComponentKinds,
    public readonly host: GameEntity) {
    host.components.set(kind, this)
  }
}

export class ParticleComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Particle, host)
  }
  radius: number = 1
  padding: number = 1
  position: vec2 = [0, 0]
  velocity: vec2 = [0, 0]
  angle: number = 0
  angularVelocity: number = 0
}

export class GrowthComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Growth, host)
  }
  /**
   * Growth requirement might be different for each entity.
   */
  calculateRequirement: (level: number) => number
  = (level: number) => 1000 * level * Math.log10(1000 * level)
  level: number = 1
  requirement: number = 0
}

export class DecayComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Decay, host)
  }
  private lifespan: number = 0
  durability: number = 1000
  calculateProbability(dt: number): number {
    this.lifespan += dt
    return this.lifespan / (this.durability + this.lifespan) / this.durability
  }
}

export class EnergyComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Energy, host)
  }
  applyAcceleration: boolean = false
  applyAngularAcceleration: boolean = false
  /**
   * change in velocity per second as the magnitude of its velocity vector;
   * also applies to angular acceleration, measured in radians per second
   * @todo
   *   acceleration modifiers?
   */
  acceleration: number = 1
  /**
   * 1 fuel = 1 second of [angular]acceleration
   */
  fuel: number = 0
}

/**
 * @todo
 *   When replicating an entity, be sure to mutate ANN
 */
export class ReplicateComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Replicate, host)
  }
  calculateProbability(): number {
    console.assert(this.host.components.has(GameComponentKinds.Energy),
      "error: host entity does not have an EnergyComponent"
    )
    const energyComponent = this.host.components.get(GameComponentKinds.Energy)!
    const fuel = (<EnergyComponent>energyComponent).fuel
    // At 80 fuel, there is an 80% probability of replication.
    return fuel / (20 + fuel)
  }
}

export class SignalComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Signal, host)
  }
  radius: number = 0
  /**
   * value between [0..1]; currently hardcoded:
   * bacteria = 1/4, oxygen = 1/2, protein = 3/4;
   * maybe compute value based on crypto hash of type name;
   * signature is used as one of the features for ML
   */
  signature: number = 0
}

export class SensorComponent extends GameComponent {
  constructor(host: GameEntity) {
    super(GameComponentKinds.Sensor, host)
  }
  detected: GameEntity[] = []
}
