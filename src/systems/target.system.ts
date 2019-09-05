/*******************************************************************************
@file target.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import Entity from "../entities/entity";
import TargetComponent from "../components/target.component";
import MobilitySystem from "./mobility.system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";

export default class TargetSystem extends System {
    constructor(private mobilitySystem: MobilitySystem) { super(); }
    update() {
        this.entities.forEach(entity => {
            const targetComponent = entity.get(TargetComponent);
            const v = entity.get(MobilityComponent).position;
            const r = targetComponent.visionRadius;
            targetComponent.targets.length = 0;
            this.mobilitySystem.entities.forEach(target => {
                if (target === entity)
                    return;

                const u = target.get(MobilityComponent).position;
                const w = LA.subtract(u, v);
                const dist = LA.dot(w, w);
                if (dist < r * r)
                    targetComponent.targets.push([target, dist]);
            });
            targetComponent.targets = targetComponent.targets.sort(
                (a, b) => a[1] - b[1]
            );
        });
    }
    protected onEntityAdded(entity: Entity) {
        entity.add(TargetComponent);
    }
}