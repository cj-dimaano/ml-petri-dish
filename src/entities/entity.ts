/*******************************************************************************
@file entity.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Component from "../components/component";
import System from "../systems/system";

export default class Entity {
    constructor(...systems: System[]) {
        systems.forEach(system => system.addEntity(this));
    }
    get<C extends Component>(component: new () => C): C {
        return this.components.get(component) as C;
    }
    add<C extends Component>(type: new () => C): C {
        const component = new type();
        this.components.set(type, component);
        return component;
    }
    private components: Map<new () => Component, Component>
        = new Map<new () => Component, Component>();
}