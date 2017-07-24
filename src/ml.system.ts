/*******************************************************************************
@file `ml.system.ts`
  Created July 23, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { GameComponentSystem } from "./game-system";
import {
  GameComponentKinds,
  MLComponent,
  ParticleComponent,
  EnergyComponent,
  SensorComponent
} from "./components";
import { GameEntity } from "./game-entity";
import { QState } from "./q-state";

export class MLSystem extends GameComponentSystem {
  constructor() {
    super(GameComponentKinds.ML)
  }
  protected createComponent(host: GameEntity): MLComponent {
    return new MLComponent(host)
  }
  update(dt: number): void {
    this.components.forEach(
      (value) => {
        const host = value.host
        const ml = <MLComponent>value
        const particle = <ParticleComponent>host.components
          .get(GameComponentKinds.Particle)!
        const energy = <EnergyComponent>host.components
          .get(GameComponentKinds.Energy)!
        const sensor = <SensorComponent>host.components
          .get(GameComponentKinds.Sensor)!
        const state = new QState(energy, particle, sensor.detected)
        if (ml.previousState !== undefined) {
          const Dy = ml.previousState.features[0] - state.features[0]
          let Q = MLComponent.Q.get(ml.previousState)
          Q = Q === undefined ? 0 : Q
          ml.ann.updateWeights(Dy - Q)
          MLComponent.Q.set(state, Dy + 0.95 * Q)
        }
        ml.previousState = state
        const action = ml.ann.chooseAction(state.features)
        energy.acceleration = Math.round(action[1])
        energy.angularAcceleration = Math.round(1 - 2 * action[2])
      }
    )
  }

}
