/*******************************************************************************
@file artificial-intelligence.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "./component";
import ArtificialNeuralNetwork from "../artificial-neural-network";

export default class ArtificialIntelligenceComponent extends Component {
    constructor() { super(ArtificialIntelligenceComponent); }

    static readonly AWAKE_TIME: number = 30;

    /**
     * @remarks
     *   9 inputs include global position, velocity magnitude, angle, linear
     *   acceleration, angular velocity, angular acceleration, and the position
     *   of a single target with respect to the agent.
     * 
     *   6 outputs include confidence values for the total number of possible
     *   action combinations (2 possible linear actions, and 3 possible angular
     *   actions).
     */
    ann: ArtificialNeuralNetwork = new ArtificialNeuralNetwork(9, 6, [10, 10]);

    /**
     * @brief Episodic memory of environment states coupled with output values,
     *   chosen action, and reward recieved.
     * @remarks
     *   These values are used to update weights while the agent is asleep.
     */
    mem: [number[], number[], number, number][] = [];

    /**
     * @brief Number of seconds the agent will be awake.
     * @remarks If the agent fails to consume anything before the timer runs
     *   out, the agent will be forced to sleep in order to update ann weights.
     */
    awakeTimer: number = 0;

    /**
     * @remarks Must be between 0 and 1.
     */
    rewardDecay: number = 0.95;

    /**
     * @brief The number of entities consumed.
     */
    score: number = 0;
}