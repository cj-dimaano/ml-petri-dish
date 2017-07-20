/*******************************************************************************
@file `longevity-protein.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameEntity } from "./game-entity"
import { ParticleSystem } from "./particle.system"
import { DecaySystem } from "./decay.system"
import { DecayComponent, GameComponentKinds } from "./components"

export class LongevityProteinEntity extends GameEntity {
  constructor(particleSystem: ParticleSystem, decaySystem: DecaySystem) {
    super()
    particleSystem.attachComponent(this);
    (decaySystem.attachComponent(this) as DecayComponent).durability = 2000
  }
  draw(g: CanvasRenderingContext2D): void { }
}
