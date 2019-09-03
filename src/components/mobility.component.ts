/*******************************************************************************
@file mobility.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "./component";

export default class MobilityComponent extends Component {
    constructor() { super(MobilityComponent); }
    position: number[] = [0, 0];
    velocity: number[] = [0, 0];
    acceleration: number = 0;
    angle: number = 0;
    angularVelocity: number = 0;
    angularAcceleration: number = 0;
}