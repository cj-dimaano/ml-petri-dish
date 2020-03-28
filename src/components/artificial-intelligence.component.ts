/*******************************************************************************
@file artificial-intelligence.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "./component";
import ArtificialNeuralNetwork from "../artificial-neural-network";

export default class ArtificialIntelligenceComponent extends Component {
    constructor() { super(ArtificialIntelligenceComponent); }

    /**
     * @remarks
     *   4 inputs include velocity vector with respect to the agent and the
     *   position of a single target with respect to the agent.
     * 
     *   6 outputs include confidence values for the total number of possible
     *   action combinations (2 possible linear actions, and 3 possible angular
     *   actions).
     */
    Pa: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(4, 6, [16, 16, 16, 16]);
    Pb: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(4, 6, [16, 16, 16, 16]);

    /**
     * @remarks
     *   These values are used to update weights.
     */
    mem: [number[], number, number, number[]][] = [];
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