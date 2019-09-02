/*******************************************************************************
@file collision.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import CollisionComponent from "../components/collision.component";
import System from "./system";
import Entity from "../entities/entity";
import * as LA from "../linear-algebra";
import MobilityComponent from "../components/mobility.component";

export default class CollisionSystem extends System {
    constructor() { super(); }
    update() {
        // @todo
        // optimize collision detection
        const entities = [...this.entities];
        for (let i = 0; i < entities.length - 1; i++) {
            const a = entities[i];
            const v = a.get(MobilityComponent).position;
            const aCollision = a.get(CollisionComponent);
            for (let j = i + 1; j < entities.length; j++) {
                const b = entities[j];
                const u = b.get(MobilityComponent).position;
                const bCollision = b.get(CollisionComponent);
                const w = LA.subtract(u, v);
                const r = Math.max(
                    aCollision.radius,
                    b.get(CollisionComponent).radius
                );
                if (LA.dot(w, w) > r * r) {
                    aCollision.collisions.add(b);
                    bCollision.collisions.add(a);
                }
                else {
                    aCollision.collisions.delete(b);
                    bCollision.collisions.delete(a);
                }

            }
        }
    }
    protected onEntityAdded(entity: Entity) {
        entity.add(CollisionComponent);
    }
}