/*******************************************************************************
@file collision.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import CollisionComponent from "../components/collision.component";
import System from "./system";
import Entity from "../entities/entity";

export default class CollisionSystem extends System {
    constructor() { super(); }
    update() {
        // @todo
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    }
    protected onEntityAdded(entity: Entity) {
        entity.add(CollisionComponent);
    }
}