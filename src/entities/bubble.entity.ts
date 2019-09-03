/*******************************************************************************
@file bubble.entity.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Entity from "./entity";
import MobilitySystem from "../systems/mobility.system";
import CollisionSystem from "../systems/collision.system";
import CollisionComponent from "../components/collision.component";
import MobilityComponent from "../components/mobility.component";

export default class BubbleEntity extends Entity {
    constructor(
        mobilitySystem: MobilitySystem,
        collisionSystem: CollisionSystem
    ) {
        super(mobilitySystem, collisionSystem);
        this.get(CollisionComponent).radius = 1;
    }

    draw(g: CanvasRenderingContext2D) {
        const r = this.get(CollisionComponent).radius;
        const p = this.get(MobilityComponent).position;

        g.strokeStyle = "blue";
        g.beginPath();
        g.arc(p[0], p[1], r, 0, 2 * Math.PI);
        g.stroke();
    }
}