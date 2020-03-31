/*******************************************************************************
@file artificial-intelligence.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import Entity from "../entities/entity";
import ArtificialIntelligenceComponent, { MasterDecider }
    from "../components/artificial-intelligence.component";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";
import CollisionComponent from "../components/collision.component";
import { FRAME_DT_S } from "../game";
import { getEnvironmentStateFromEntity, getVectorFromEnvironmentState } from "../environment-state";

export default class ArtificialIntelligenceSystem extends System {
    constructor() { super(); }
    update() {
        this.entities.forEach(entity => {
            const state = getVectorFromEnvironmentState(getEnvironmentStateFromEntity(entity));
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
            } else if (ai.memCount < ai.accelerateMaster.mem.length) {
                mobility.acceleration = 0;
                mobility.angularAcceleration = 0;
                ai.memCount++;
                const index = Math.floor(Math.random() * ai.accelerateMaster.mem.length);
                const [accelerateMaster, turnMaster] = [ai.accelerateMaster, ai.turnMaster];
                updateWeights(accelerateMaster, ai.discountFactor, ...accelerateMaster.mem[index]);
                updateWeights(turnMaster, ai.discountFactor, ...turnMaster.mem[index]);
            } else {
                // ai.mem.length = 0;
                ai.memCount = 0;
                ai.accelerateMaster.mem.push([state, 0, 0, []]);
                ai.turnMaster.mem.push([state, 0, 0, []]);
                ai.sleepTick += ai.sleepTime;
                ai.wakeCount += 1;
            }
        });
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

    const [turnMaster, accelerateMaster] = [ai.turnMaster, ai.accelerateMaster];

    const [
        lastTurnMem,
        lastAccelerateMem
    ] = [
            turnMaster.mem[turnMaster.mem.length - 1],
            accelerateMaster.mem[accelerateMaster.mem.length - 1]
        ];
    [
        lastTurnMem[3],
        lastAccelerateMem[3]
    ] = [state, state];

    // update reward
    [
        lastTurnMem[2],
        lastAccelerateMem[2]
    ] = [
            getTurnReward(state),
            getAccelerateReward(state)
        ];

    // update score
    if (collisionCount > 0) {
        ai.score += collisionCount;
        ai.sleepTick += collisionCount;
    }

    // update sample tick
    ai.sampleTick += dt;
    if (ai.sampleTick < ai.sampleTime)
        return;
    ai.sampleTick -= ai.sampleTime;

    // get decisions
    mobility.acceleration = getAcceleration(accelerateMaster, state, ai.score);
    mobility.angularAcceleration = getAngularAcceleration(turnMaster, state, ai.score);
}

function getTurnReward(state: number[]): number {
    const [x, y] = [state[2], state[3]];
    /*
    The turn reward is calculated as the facing direction of the agent with respect to the target in
    radians, scaled between -1 to 1, squared, and then subtracted from 1.
    */
    const d = 2 * Math.atan2(x, y) / LA.TAU - 1;
    return 1 - d * d;
}

function getAccelerateReward(state: number[]): number {
    const [x, y] = [state[2], state[3]];
    // The closer the target, the higher the reward
    return Math.abs(1 - LA.magnitude([x, y]) / 100); // 100 === vision radius
}

function getAcceleration(
    ai: MasterDecider,
    state: number[],
    score: number
): number {
    const Qa = ai.Pa.generateOutputs(state);
    const Qb = ai.Pb.generateOutputs(state);
    const choice = makeChoice(Qa, Qb, score);
    // save current memory
    if (ai.mem.length === 256)
        ai.mem.shift();
    ai.mem.push([state, choice, 0, []]);
    return choice * 2;
}

function getAngularAcceleration(
    ai: MasterDecider,
    state: number[],
    score: number
): number {
    const Qa = ai.Pa.generateOutputs(state);
    const Qb = ai.Pb.generateOutputs(state);
    const choice = makeChoice(Qa, Qb, score);
    // save current memory
    if (ai.mem.length === 256)
        ai.mem.shift();
    ai.mem.push([state, choice, 0, []]);
    if (choice === 1)
        return -10;
    else if (choice === 2)
        return 10;
    return 0;
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
    ai: MasterDecider,
    discountFactor: number,
    state: number[],
    choice: number,
    reward: number,
    nextState: number[]
) {
    console.assert(!state.find(Number.isNaN));
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
            + discountFactor
            * QbNext[argMax(QaNext)]
            - mChoiceA
        );
    const QbUpdate
        = mChoiceB
        + ai.Pb.learningRate
        * (
            reward
            + discountFactor
            * QaNext[argMax(QbNext)]
            - mChoiceB
        );
    Qa[choice] = Math.max(0, QaUpdate);
    Qb[choice] = Math.max(0, QbUpdate);

    ai.Pa.updateWeights(state, normalize(Qa));
    ai.Pb.updateWeights(state, normalize(Qb));
}