/*******************************************************************************
@file mobility.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";

const DEG2RAD = Math.PI / 180;
const MAX_VELOCITY = 5;
const MAX_ANGULAR_VELOCITY = 6 * DEG2RAD;
const MIN_ANGULAR_VELOCITY = -6 * DEG2RAD;

export default class MobilitySystem extends System<MobilityComponent> {
    constructor(canvas: HTMLCanvasElement) {
        super(MobilityComponent);
        this.bounds = [0, 0, canvas.width, canvas.height];
    }
    readonly bounds: [number, number, number, number];
    update(dt: number) {
        dt = dt / 1000.0;
        this.components.forEach(component => {
            // update angular velocity
            component.angularVelocity = Math.min(Math.max(
                component.angularVelocity
                + component.angularAcceleration * dt * DEG2RAD * 10,
                MIN_ANGULAR_VELOCITY
            ), MAX_ANGULAR_VELOCITY);

            // apply angular velocity
            component.angle = (component.angle + component.angularVelocity)
                % LA.TAU;

            // update velocity
            const acceleration = LA.rotate(
                [component.acceleration * dt * 2, 0],
                component.angle
            );
            component.velocity = LA.add(component.velocity, acceleration);
            if (LA.magnitude(component.velocity) > MAX_VELOCITY) {
                component.velocity = LA.scale(
                    LA.normalize(component.velocity),
                    MAX_VELOCITY
                );
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
    getRandomPoint() {
        const a = this.bounds[0];
        const b = this.bounds[1];
        const c = this.bounds[2];
        const d = this.bounds[3];
        return [
            a + Math.random() * (c - a),
            b + Math.random() * (d - b)
        ];
    }
}
