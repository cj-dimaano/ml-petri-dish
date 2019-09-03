/*******************************************************************************
@file target.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "./component";
import Entity from "../entities/entity";

export default class TargetComponent extends Component {
    constructor() { super(TargetComponent); }
    /**
     * @brief List of valid targets sorted by shortest distance.
     */
    targets: [Entity, number][] = [];
    visionRadius: number = 50;
}