/*******************************************************************************
@file consumer.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
@todo consume effects
@todo respawn system
*******************************************************************************/

import System from "./system";
import CollisionComponent from "../components/collision.component";
import MobilitySystem from "./mobility.system";

export default class ConsumerSystem extends System {
    constructor(private readonly mobilitySystem: MobilitySystem) { super(); }
    update() {
        this.entities.forEach(entity => {
            const collisions = entity.get(CollisionComponent).collisions;
            collisions.forEach(
                collision => {
                    collision.get(CollisionComponent).collisions.delete(entity);
                    this.mobilitySystem.spawn(collision);
                }
            );
            collisions.clear();
        });
    }
}