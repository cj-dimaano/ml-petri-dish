/*******************************************************************************
@file agent.entity.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import MobilitySystem from "../systems/mobility.system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";
import CollisionSystem from "../systems/collision.system";
import CollisionComponent from "../components/collision.component";
import Entity from "./entity";
import ConsumerSystem from "../systems/consumer.system";
import TargetSystem from "../systems/target.system";
import ArtificialIntelligenceSystem from "../systems/artificial-intelligence.system";
import ArtificialIntelligenceComponent from "../components/artificial-intelligence.component";

export default class AgentEntity extends Entity {
    constructor(
        mobilitySystem: MobilitySystem,
        collisionSystem: CollisionSystem,
        consumerSystem: ConsumerSystem,
        targetSystem: TargetSystem,
        aiSystem: ArtificialIntelligenceSystem
    ) {
        super(
            mobilitySystem,
            collisionSystem,
            consumerSystem,
            targetSystem,
            aiSystem
        );
        this.get(CollisionComponent).radius = 5;
    }

    draw(g: CanvasRenderingContext2D) {
        const r = this.get(CollisionComponent).radius;
        const a = this.get(MobilityComponent).angle;
        const p = this.get(MobilityComponent).position;
        const v = LA.rotate([3, 0], a);
        const vr = this.get(ArtificialIntelligenceComponent).awakeTimer > 0
            ? 15
            : 0;

        g.shadowBlur = vr;
        g.shadowColor = "gray";
        g.fillStyle = "white";
        g.strokeStyle = "black";
        g.beginPath();
        g.arc(p[0], p[1], r, 0, 2 * Math.PI);
        g.fill();
        g.stroke();

        g.shadowBlur = 0;
        g.beginPath();
        g.arc(p[0] + v[0], p[1] + v[1], 1, 0, 2 * Math.PI);
        g.stroke();
    }
}