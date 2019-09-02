/*******************************************************************************
@file agent.entity.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import MobilitySystem from "../systems/mobility.system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";

export default class AgentEntity {
    constructor(mobilitySystem: MobilitySystem) {
        this.mobilityComponent = mobilitySystem.addComponent();
        this.mobilityComponent.position = mobilitySystem.getRandomPoint();
    }

    mobilityComponent: MobilityComponent;

    draw(g: CanvasRenderingContext2D) {
        const a = this.mobilityComponent.angle;
        const p = this.mobilityComponent.position;
        const v = LA.rotate([3, 0], a);

        g.strokeStyle = "black";
        g.beginPath();
        g.arc(p[0], p[1], 5, 0, 2 * Math.PI);
        g.stroke();

        g.beginPath();
        g.arc(p[0] + v[0], p[1] + v[1], 1, 0, 2 * Math.PI);
        g.stroke();
    }
}