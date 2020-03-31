/*******************************************************************************
@file artificial-intelligence.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "./component";
import ArtificialNeuralNetwork from "../artificial-neural-network";

export type MasterDecider = {
    Pa: ArtificialNeuralNetwork,
    Pb: ArtificialNeuralNetwork,
    mem: [number[], number, number, number[]][]
}

export default class ArtificialIntelligenceComponent extends Component {
    constructor() { super(ArtificialIntelligenceComponent); }

    /**
     * @remarks
     *   4 inputs include velocity vector with respect to the agent and the
     *   position of a single target with respect to the agent.
     */

    turnMaster: MasterDecider = {
        Pa: new ArtificialNeuralNetwork(4, 3, [16, 16, 16, 16]),
        Pb: new ArtificialNeuralNetwork(4, 3, [16, 16, 16, 16]),
        mem: []
    };

    accelerateMaster: MasterDecider = {
        Pa: new ArtificialNeuralNetwork(4, 2, [16, 16, 16, 16]),
        Pb: new ArtificialNeuralNetwork(4, 2, [16, 16, 16, 16]),
        mem: []
    };

    memCount: number = 0;

    /**
     * @remarks Must be between 0 and 1.
     */
    discountFactor: number = 0.99;

    /**
     * @brief The number of entities consumed.
     */
    score: number = 0;

    /**
     * @brief The number of times the agent has been active
     */
    wakeCount: number = 0;

    /**
     * @brief Time between each sample.
     */
    sampleTime: number = 1.0 / 5.0;
    sampleTick: number = 0;

    /**
     * @brief Time until each resting period.
     * @remarks Used for experience replay learning.
     */
    sleepTime: number = 10;
    sleepTick: number = 0;
}