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
     *   2 inputs include position of a single target with respect to the agent.
     * 
     *   6 outputs include confidence values for the total number of possible
     *   action combinations (2 possible linear actions, and 3 possible angular
     *   actions).
     */
    Pa: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(2, 6, [16, 16, 16, 16]);
    Pb: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(2, 6, [16, 16, 16, 16]);

    /**
     * @remarks
     *   These values are used to update weights.
     */
    mem: [number[], number[], number[], number, number] = [[], [], [], 0, 0];

    /**
     * @remarks Must be between 0 and 1.
     */
    discountFactor: number = 1.0;

    /**
     * @brief The number of entities consumed.
     */
    score: number = 0;

    /**
     * @brief Time between each sample.
     */
    sampleSpeed: number = 1.0 / 5.0;

    sampleTick: number = 0;
}