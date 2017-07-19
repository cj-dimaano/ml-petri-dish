/*******************************************************************************
@file `fiat.system.ts`
  Created July 19, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameSystem } from "game-system"
import { BubbleEntity } from "bubble.entity"
import { LongevityProteinEntity } from "longevity-protein.entity"
import { BacteriumEntity } from "bacterium.entity"

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

  private bacteria: BacteriumEntity[] = []
  private bubbles: BubbleEntity[] = []
  private proteins: LongevityProteinEntity[] = []

  private pBubbles: number = 0
  private pProteins: number = 0
  private pBacteria: number = 0

  update(dt: number): void {
  }

  updateProbabilities(): void {
  }
}
