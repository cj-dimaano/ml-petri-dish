/*******************************************************************************
@file system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Entity from "../entities/entity";

export default abstract class System {
    entities: Set<Entity> = new Set<Entity>();
    /**
     * @param dt The amount of time passed since the previous update in seconds.
     */
    abstract update(dt: number): void;
    addEntity(entity: Entity) {
        this.entities.add(entity);
        this.onEntityAdded(entity);
    }
    protected onEntityAdded(entity: Entity) { }
}