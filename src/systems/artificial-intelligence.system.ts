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
import { FRAME_DT_S } from "../game";

export default class ArtificialIntelligenceSystem extends System {
    constructor() { super(); }
    update() {
        this.entities.forEach(entity => {
            const state = this.getEnvironmentState(entity);
            const ai = entity.get(ArtificialIntelligenceComponent);
            const mobility = entity.get(MobilityComponent);

            if (ai.sleepTick > 0) {
                updateAction(
                    FRAME_DT_S,
                    ai,
                    mobility,
                    state,
                    entity.get(CollisionComponent).collisions.size
                );
            } else if (ai.memCount < ai.mem.length) {
                mobility.acceleration = 0;
                mobility.angularAcceleration = 0;
                ai.memCount++;
                const mem = ai.mem[Math.floor(Math.random() * ai.mem.length)];
                updateWeights(ai, ...mem);
            } else {
                // ai.mem.length = 0;
                ai.memCount = 0;
                ai.mem.push([state, 0, 0, []]);
                ai.sleepTick += ai.sleepTime;
                ai.wakeCount += 1;
            }
        });
    }
    getEnvironmentState(entity: Entity): number[] {
        const mobility = entity.get(MobilityComponent);
        const targets = entity.get(TargetComponent).targets;
        const v = mobility.position;
        const u = targets.length > 0
            ? targets[0][0].get(MobilityComponent).position
            : v;
        return [
            ...LA.rotate(mobility.velocity, -mobility.angle),
            ...LA.rotate(LA.difference(u, v), -mobility.angle)
        ];
    }
    protected onEntityAdded(entity: Entity) {
        entity.add(ArtificialIntelligenceComponent);
    }
}

function roulette(options: number[]): number {
    const sum = options.reduce((p, c) => p + c);
    if (sum > 0) {
        let rng = Math.random() * sum;
        return options.findIndex(v => {
            rng -= v;
            return rng <= 0;
        });
    }
    return options[Math.floor(Math.random() * options.length)];
}

function updateAction(
    dt: number,
    ai: ArtificialIntelligenceComponent,
    mobility: MobilityComponent,
    state: number[],
    collisionCount: number
) {
    ai.sleepTick -= dt;

    const lastMem = ai.mem[ai.mem.length - 1];
    lastMem[3] = state;
    lastMem[2] -= dt;

    // update score
    if (collisionCount > 0) {
        lastMem[2] = collisionCount;
        ai.score += collisionCount;
        ai.sleepTick += collisionCount;
    }

    // update sample tick
    ai.sampleTick += dt;
    if (ai.sampleTick < ai.sampleTime)
        return;
    ai.sampleTick -= ai.sampleTime;

    // get Q predictions
    const Qa = ai.Pa.generateOutputs(state);
    const Qb = ai.Pb.generateOutputs(state);

    // apply output choice
    const choice = makeChoice(Qa, Qb, ai.score);
    console.assert(choice > -1 && choice < 6);
    mobility.acceleration = 0;
    mobility.angularAcceleration = 0;
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

    // save current memory
    if (ai.mem.length === 256)
        ai.mem.shift();
    ai.mem.push([state, choice, 0, []]);
}

function argMax(options: number[]): number {
    return options.reduce((p, c, i, a) => a[p] < c ? i : p, 0);
}

function makeChoice(Qa: number[], Qb: number[], score: number): number {
    const fn = Math.random() < 10 / (10 + score)
        ? roulette
        : argMax;

    const a = fn(Qa);
    const b = fn(Qb);

    return Qa[a] < Qb[b] ? a : b;
}

/**
 * @brief Scales an array of numbers so that the total sum is 1.
 * @param v Array of numbers to scale.
 */
function normalize(v: number[]): number[] {
    const sum = v.reduce((p, c) => p + c);
    return LA.scale(v, 1.0 / sum);
}

function updateWeights(
    ai: ArtificialIntelligenceComponent,
    state: number[],
    choice: number,
    reward: number,
    nextState: number[]
) {
    state.forEach(v => console.assert(!Number.isNaN(v)));
    const Qa = ai.Pa.generateOutputs(state);
    const Qb = ai.Pb.generateOutputs(state);
    const QaNext = nextState.length > 0
        ? ai.Pa.generateOutputs(nextState)
        : Array(Qa.length).fill(0);
    const QbNext = nextState.length > 0
        ? ai.Pb.generateOutputs(nextState)
        : Array(Qb.length).fill(0);

    const mChoiceA = Qa[choice];
    const mChoiceB = Qb[choice];

    const QaUpdate
        = mChoiceA
        + ai.Pa.learningRate
        * (
            reward
            + ai.discountFactor
            * QbNext[argMax(QaNext)]
            - mChoiceA
        );
    const QbUpdate
        = mChoiceB
        + ai.Pb.learningRate
        * (
            reward
            + ai.discountFactor
            * QaNext[argMax(QbNext)]
            - mChoiceB
        );
    Qa[choice] = Math.max(0, QaUpdate);
    Qb[choice] = Math.max(0, QbUpdate);

    ai.Pa.updateWeights(state, normalize(Qa));
    ai.Pb.updateWeights(state, normalize(Qb));
}