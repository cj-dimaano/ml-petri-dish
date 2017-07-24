/*******************************************************************************
@file `fiat.system.ts`
  Created July 19, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameSystem } from "./game-system"
import { GameEntity } from "./game-entity"
import { BubbleEntity } from "./bubble.entity"
import { LongevityProteinEntity } from "./longevity-protein.entity"
import { BacteriumEntity } from "./bacterium.entity"
import { ParticleSystem } from "./particle.system"
import { DecaySystem } from "./decay.system"
import { SignalSystem } from "./signal.system";
import { SensorSystem } from "./sensor.system";
import { EnergySystem } from "./energy.system";
import { AbsorbSystem } from "./absorb.system";
import { MLSystem } from "./ml.system";
import { ReplicateSystem } from "./replicate.system";

/**
 * @summary
 *   Represents the entity spawning system.
 * 
 * @description
 *   Entities spawn randomly on the map over time with the probabilities of each
 *   entity spawning as a function of the number of entities present.
 */
export class FiatSystem extends GameSystem {
  constructor() {
    super()
    this.updateProbabilities()
  }

  private pBubbles: number = 0
  private pProteins: number = 0
  private pBacteria: number = 0

  bacteria: BacteriumEntity[] = []
  bubbles: BubbleEntity[] = []
  proteins: LongevityProteinEntity[] = []

  readonly particleSystem: ParticleSystem = new ParticleSystem()
  readonly decaySystem: DecaySystem = new DecaySystem()
  readonly signalSystem: SignalSystem = new SignalSystem()
  readonly sensorSystem: SensorSystem = new SensorSystem()
  readonly energySystem: EnergySystem = new EnergySystem()
  readonly absorbSystem: AbsorbSystem = new AbsorbSystem()
  readonly replicateSystem: ReplicateSystem = new ReplicateSystem()
  readonly mlSystem: MLSystem = new MLSystem()

  update(dt: number): void {
    this.replicateSystem.update(dt)
    this.decaySystem.update(dt)
    this.signalSystem.update(dt)
    this.sensorSystem.update(dt)
    this.absorbSystem.update(dt)
    this.mlSystem.update(dt)
    this.energySystem.update(dt)
    this.particleSystem.update(dt)
    const sec = dt / 1000
    let updateProbabilities = false
    const filterFn =
      (value: GameEntity) => {
        const isDisposed = value.isDisposed
        updateProbabilities = updateProbabilities || isDisposed
        return !isDisposed
      }
    this.bubbles = this.bubbles.filter(filterFn)
    this.proteins = this.proteins.filter(filterFn)
    this.bacteria = this.bacteria.filter(filterFn)
    if (this.bubbles.length < 15) {
    // if (Math.random() < this.pBubbles * sec) {
      this.bubbles.push(
        new BubbleEntity(
          this.particleSystem,
          this.decaySystem,
          this.signalSystem))
      updateProbabilities = true
    }
    if (this.proteins.length < 20) {
    // if (Math.random() < this.pProteins * sec) {
      this.proteins.push(
        new LongevityProteinEntity(
          this.particleSystem,
          this.decaySystem,
          this.signalSystem))
      updateProbabilities = true
    }
    if (this.bacteria.length < 10) {
    // if (Math.random() < this.pBacteria * sec) {
      this.addBacterium()
      updateProbabilities = false
    }
    if (updateProbabilities)
      this.updateProbabilities()
  }

  updateProbabilities(): void {
    const bubbles = this.bubbles.length + 4 * this.bacteria.length
    this.pBubbles = 1 - bubbles / (900 + bubbles)
    // this.pBubbles = 1 - bubbles / (300 + bubbles)

    const proteins = this.proteins.length + 12 * this.bacteria.length
    this.pProteins = 1 - proteins / (900 + proteins)

    const bacteria = this.bacteria.length
    this.pBacteria = 1 - 1 / (1 + Math.pow(2, -bacteria / 3))
  }
  addBacterium(): BacteriumEntity {
    const bacterium = new BacteriumEntity(
      this.particleSystem,
      this.decaySystem,
      this.signalSystem,
      this.sensorSystem,
      this.energySystem,
      this.absorbSystem,
      this.mlSystem)
    this.bacteria.push(bacterium)
    this.updateProbabilities()
    return bacterium
  }
}
