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
    update() {
        this.entities.forEach(entity => {
            const ai = entity.get(ArtificialIntelligenceComponent);
            const mobility = entity.get(MobilityComponent);
            mobility.acceleration = 0;
            mobility.angularAcceleration = 0;
            const state = this.getEnvironmentState(entity);

            if (entity.get(CollisionComponent).collisions.size > 0) {
                ai.mem[4] = entity.get(CollisionComponent).collisions.size;
                ai.score++;
            }

            // get Q predictions
            const Qa = ai.Pa.generateOutputs(state);
            const Qb = ai.Pb.generateOutputs(state);

            const choice = makeChoice(Qa, Qb, ai.score);
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

            // update weights for previous memory
            updateWeights(ai, Qa, Qb);

            // save current memory
            ai.mem = [state, Qa, Qb, choice, 0];
        });
    }
    getEnvironmentState(entity: Entity): number[] {
        const mobility = entity.get(MobilityComponent);
        const targets = entity.get(TargetComponent).targets;
        const v = mobility.position;
        const u = targets.length > 0
            ? targets[0][0].get(MobilityComponent).position
            : v;
        return [...LA.rotate(LA.subtract(u, v), -mobility.angle)];
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

function softMax(v: number[]): number[] {
    const sum = v.reduce((p, c) => p + c);
    return LA.scale(v, 1.0 / sum);
}

function updateWeights(
    ai: ArtificialIntelligenceComponent,
    QaNext: number[],
    QbNext: number[]
) {
    const state = ai.mem[0];
    const Qa = ai.mem[1];
    const Qb = ai.mem[2];
    const choice = ai.mem[3];
    const r = ai.mem[4];

    const mChoiceA = Qa[choice];
    const mChoiceB = Qb[choice];

    const QaUpdate
        = mChoiceA
        + ai.Pa.learningRate
        * (
            r
            + ai.discountFactor
            * QbNext[argMax(QaNext)]
            - mChoiceA
        );
    const QbUpdate
        = mChoiceB
        + ai.Pb.learningRate
        * (
            r
            + ai.discountFactor
            * QaNext[argMax(QbNext)]
            - mChoiceB
        );
    Qa[choice] = QaUpdate;
    Qb[choice] = QbUpdate;

    ai.Pa.updateWeights(state, softMax(Qa));
    ai.Pb.updateWeights(state, softMax(Qb));
}