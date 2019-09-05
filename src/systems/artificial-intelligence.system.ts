/*******************************************************************************
@file artificial-intelligence.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import Entity from "../entities/entity";
import ArtificialIntelligenceComponent
    from "../components/artificial-intelligence.component";
import MobilityComponent from "../components/mobility.component";
import TargetComponent from "../components/target.component";
import * as LA from "../linear-algebra";
import CollisionComponent from "../components/collision.component";

export default class ArtificialIntelligenceSystem extends System {
    constructor() { super(); }
    update(dt: number) {
        this.entities.forEach(entity => {
            const ai = entity.get(ArtificialIntelligenceComponent);
            const mobility = entity.get(MobilityComponent);
            mobility.acceleration = 0;
            mobility.angularAcceleration = 0;
            if (ai.awakeTimer > 0) {
                if (entity.get(CollisionComponent).collisions.size > 0) {
                    ai.awakeTimer = 0;
                    ai.mem[ai.mem.length - 1][3] = 1;
                    ai.score++;
                }
                else {
                    ai.awakeTimer -= dt;
                    const state = this.getEnvironmentState(entity);
                    const outputs = ai.ann.generateOutputs(state);

                    // choose an output via roulette algorithm
                    const outputsSum = outputs.reduce((p, c) => p + c, 0);
                    let roulette = Math.random() * outputsSum;
                    const choice = outputs.findIndex(v => {
                        roulette -= v;
                        return roulette < 0;
                    });
                    console.assert(choice > -1 && choice < 6);

                    // apply output choice
                    switch (choice) {
                        case 1:
                            mobility.acceleration = 0;
                            mobility.angularAcceleration = 10;
                            break;

                        case 2:
                            mobility.acceleration = 0;
                            mobility.angularAcceleration = -10;
                            break;

                        case 3:
                            mobility.acceleration = 2;
                            mobility.angularAcceleration = 0;
                            break;

                        case 4:
                            mobility.acceleration = 2;
                            mobility.angularAcceleration = 10;
                            break;

                        case 5:
                            mobility.acceleration = 2;
                            mobility.angularAcceleration = -10;
                            break;
                    }

                    // update previous memory
                    /* https://en.wikipedia.org/wiki/Q-learning#Algorithm */
                    const learningRate = ai.ann.learningRate;
                    const prevMem = ai.mem[ai.mem.length - 1];
                    prevMem[3]
                        = (1 - learningRate) * prevMem[1][prevMem[2]]
                        + learningRate * (
                            0 /* intermediate reward (could be distance) */
                            + outputs.reduce((p, c) => Math.max(p, c), 0)
                            * ai.rewardDecay
                        );

                    // save current memory
                    ai.mem.push([state, outputs, choice, 0]);
                }
            } else if (ai.mem.length > 0) {
                const mem = ai.mem.shift()!;
                const x = mem[0];
                const t = mem[1];
                t[mem[2]] = mem[3];
                ai.ann.updateWeights(x, t);
            } else {
                ai.awakeTimer
                    = ArtificialIntelligenceComponent.AWAKE_TIME;
                const state = this.getEnvironmentState(entity);
                const outputs = ai.ann.generateOutputs(state);
                ai.mem.push([state, outputs, 0, 0]);
            }
        });
    }
    getEnvironmentState(entity: Entity): number[] {
        const mobility = entity.get(MobilityComponent);
        const targets = entity.get(TargetComponent).targets;
        const v = mobility.position;
        const u = targets.length > 0
            ? targets[0][0].get(MobilityComponent).position
            : [0, 0];
        return [
            ...v,
            LA.magnitude(mobility.velocity),
            mobility.angle,
            mobility.acceleration,
            mobility.angularVelocity,
            mobility.angularAcceleration,
            ...u
        ];
    }
    protected onEntityAdded(entity: Entity) {
        entity.add(ArtificialIntelligenceComponent);
    }
}