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
     *   9 inputs include global position, velocity magnitude, angle, linear
     *   acceleration, angular velocity, angular acceleration, and the global 
     *   position of a single target.
     * 
     *   6 outputs include confidence values for the total number of possible
     *   action combinations (2 possible linear actions, and 3 possible angular
     *   actions).
     */
    Pa: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(9, 6, [20, 20]);
    Pb: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(9, 6, [20, 20]);

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
}