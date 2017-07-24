/*******************************************************************************
@file `bacterium.entity.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>

@todo
  pulse `cos(x*x*pi)sin(x*x*pi/3)`, has period 1.73, range -.21 to .21
*******************************************************************************/

import { GameEntity } from "./game-entity"
import { ParticleSystem } from "./particle.system";
import { DecaySystem } from "./decay.system";
import {
  ParticleComponent,
  DecayComponent,
  GameComponentKinds,
  SignalComponent,
  EnergyComponent
} from "./components";
import { PIx2 } from "./math-ex";
import { SignalSystem } from "./signal.system";
import { SensorSystem } from "./sensor.system";
import { EnergySystem } from "./energy.system";
import { AbsorbSystem } from "./absorb.system";
import { MLSystem } from "./ml.system";

export class BacteriumEntity extends GameEntity {
  constructor(
    particleSystem: ParticleSystem,
    decaySystem: DecaySystem,
    signalSystem: SignalSystem,
    sensorSystem: SensorSystem,
    energySystem: EnergySystem,
    absorbSystem: AbsorbSystem,
    mlSystem: MLSystem
  ) {
    super()
    const particle = <ParticleComponent>particleSystem.attachComponent(this)
    const decay = <DecayComponent>decaySystem.attachComponent(this)
    const signal = <SignalComponent>signalSystem.attachComponent(this)
    sensorSystem.attachComponent(this)
    const energy = <EnergyComponent>energySystem.attachComponent(this)
    absorbSystem.attachComponent(this)
    mlSystem.attachComponent(this)
    energy.fuel = 5
    signal.signature = 1 / 4
    signal.radius = 30
    decay.durability *= 4
    particle.velocity[0] = 1 - 2 * Math.random()
    particle.velocity[1] = 1 - 2 * Math.random()
    particle.angularVelocity = 0.01 - 0.02 * Math.random()
    particle.angle = Math.random() * 2 * PIx2
    particle.radius = 5
    particle.padding = 3
  }
  draw(g: CanvasRenderingContext2D): void {
    const particle = <ParticleComponent>this.components
      .get(GameComponentKinds.Particle)
    const p = particle.position
    const r1 = particle.radius
    const r2 = 3 * r1 / 5
    g.strokeStyle = "black"
    g.beginPath()
    g.arc(p[0], p[1], r1, 0, PIx2)
    g.stroke()
    // for (let i = -PIx2 / 10; i < PIx2; i += PIx2 / 5) {
    let i = -PIx2 / 10
    g.beginPath()
    g.arc(
      p[0], p[1],
      r2,
      i + particle.angle,
      Math.PI / 4 + i + particle.angle)
    g.stroke()
    // }
  }
}
