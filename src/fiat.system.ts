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

/**
 * @summary
 *   Represents the entity spawning system.
 * 
 * @description
 *   Entities spawn randomly on the map over time with the probabilities of each
 *   entity spawning as a function of the number of entities present.
 */
export class FiatSystem extends GameSystem {
  constructor(screenHeight: number, screenWidth: number) {
    super()
    this.particleSystem = new ParticleSystem(screenHeight, screenWidth)
    this.decaySystem = new DecaySystem()
    this.signalSystem = new SignalSystem()
    this.sensorSystem = new SensorSystem(this.signalSystem)
    this.energySystem = new EnergySystem()
    this.absorbSystem = new AbsorbSystem()
    this.updateProbabilities()
  }

  private particleSystem: ParticleSystem
  private decaySystem: DecaySystem
  private signalSystem: SignalSystem
  private sensorSystem: SensorSystem
  private energySystem: EnergySystem
  private absorbSystem: AbsorbSystem
  // private replicateSystem: ReplicateSystem

  private pBubbles: number = 0
  private pProteins: number = 0
  private pBacteria: number = 0.01

  bacteria: BacteriumEntity[] = []
  bubbles: BubbleEntity[] = []
  proteins: LongevityProteinEntity[] = []

  update(dt: number): void {
    this.decaySystem.update(dt)
    this.signalSystem.update(dt)
    this.sensorSystem.update(dt)
    this.absorbSystem.update(dt)
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
    if (Math.random() < this.pBubbles * sec) {
      this.bubbles.push(
        new BubbleEntity(
          this.particleSystem,
          this.decaySystem,
          this.signalSystem))
      updateProbabilities = true
    }
    if (Math.random() < this.pProteins * sec) {
      this.proteins.push(
        new LongevityProteinEntity(
          this.particleSystem,
          this.decaySystem,
          this.signalSystem))
      updateProbabilities = true
    }
    if (Math.random() < this.pBacteria * sec) {
      this.bacteria.push(
        new BacteriumEntity(
          this.particleSystem,
          this.decaySystem,
          this.signalSystem,
          this.sensorSystem,
          this.energySystem,
          this.absorbSystem)
      )
      updateProbabilities = true
    }
    if (updateProbabilities)
      this.updateProbabilities()
  }

  updateProbabilities(): void {
    const bubbles = this.bubbles.length + 4 * this.bacteria.length
    this.pBubbles = 1 - bubbles / (30 + bubbles)

    const proteins = this.proteins.length + 12 * this.bacteria.length
    this.pProteins = 1 - proteins / (100 + proteins)
  }
}
