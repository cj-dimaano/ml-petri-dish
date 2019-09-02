/*******************************************************************************
@file mobility.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";

const MAX_VELOCITY = 5;
const MAX_ANGULAR_VELOCITY = 5;
const MIN_ANGULAR_VELOCITY = -5;

export default class MobilitySystem extends System<MobilityComponent> {
    constructor() { super(MobilityComponent); }
    bounds: [number, number, number, number] =
        [-Infinity, -Infinity, Infinity, Infinity];
    update() {
        this.components.forEach(component => {
            // update angular velocity
            component.angularVelocity = Math.min(Math.max(
                component.angularVelocity + component.angularAcceleration,
                MIN_ANGULAR_VELOCITY
            ), MAX_ANGULAR_VELOCITY);

            // apply angular velocity
            component.position = LA.rotate(
                component.position,
                component.angularVelocity
            );

            // update velocity
            if (LA.magnitude(component.velocity) < MAX_VELOCITY) {
                const acceleration = LA.scale(
                    LA.normalize(component.position),
                    component.acceleration
                );
                component.velocity = LA.add(component.velocity, acceleration);
                if (LA.magnitude(component.velocity) > MAX_VELOCITY) {
                    component.velocity = LA.scale(
                        LA.normalize(component.velocity),
                        MAX_VELOCITY
                    );
                }
            }

            // update position
            component.position = LA.add(component.position, component.velocity);
            component.position[0] = Math.min(Math.max(
                component.position[0],
                this.bounds[0]
            ), this.bounds[2]);
            component.position[1] = Math.min(Math.max(
                component.position[1],
                this.bounds[1]
            ), this.bounds[3]);
        });
    }
}
