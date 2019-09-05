/*******************************************************************************
@file collision.component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
@todo enforce collisions set to only contain entities that have a mobility
  component.
*******************************************************************************/

import Component from "./component";
import Entity from "../entities/entity";

export default class CollisionComponent extends Component {
    constructor() { super(CollisionComponent); }
    collisions: Set<Entity> = new Set<Entity>();
    /**
     * @remark All collisions are currently being treated as circular
     *   collisions for simplicity.
     */
    radius: number = 0.5;
}