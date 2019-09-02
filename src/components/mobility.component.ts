/*******************************************************************************
@file mobility.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export default class MobilityComponent {
    constructor() { }
    position: number[] = [0, 0];
    velocity: number[] = [0, 0];
    acceleration: number = 0;
    angularVelocity: number = 0;
    angularAcceleration: number = 0;
}