/*******************************************************************************
@file mobility.system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import System from "./system";
import MobilityComponent from "../components/mobility.component";
import * as LA from "../linear-algebra";
import Entity from "../entities/entity";
import { FRAME_DT } from "../game";

const DEG2RAD = Math.PI / 180;
const MAX_VELOCITY = 60;
const MAX_ANGULAR_VELOCITY = 240 * DEG2RAD;
const MIN_ANGULAR_VELOCITY = -240 * DEG2RAD;
const FRICTION = 0.1;

export default class MobilitySystem extends System {
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.bounds = [0, 0, canvas.width, canvas.height];
    }
    readonly bounds: [number, number, number, number];
    update() {
        this.entities.forEach(entity => {
            const component = entity.get(MobilityComponent);
            // update angular velocity
            if (component.angularAcceleration === 0) {
                component.angularVelocity -=
                    FRICTION * component.angularVelocity;
            }
            else {
                component.angularVelocity = Math.min(Math.max(
                    component.angularVelocity
                    + component.angularAcceleration * DEG2RAD,
                    MIN_ANGULAR_VELOCITY
                ), MAX_ANGULAR_VELOCITY);
            }

            // apply angular velocity
            component.angle = (component.angle + component.angularVelocity * FRAME_DT)
                % LA.TAU;

            // update velocity
            if (component.acceleration === 0) {
                component.velocity =
                    LA.scale(component.velocity, 1.0 - FRICTION);
            }
            else {
                const acceleration = LA.rotate(
                    [component.acceleration, 0],
                    component.angle
                );
                component.velocity = LA.sum(component.velocity, acceleration);
                if (LA.magnitude(component.velocity) > MAX_VELOCITY) {
                    component.velocity = LA.scale(
                        LA.normalize(component.velocity),
                        MAX_VELOCITY
                    );
                }
            }

            // update position
            const v = LA.scale(component.velocity, FRAME_DT);
            component.position = LA.sum(component.position, v);
            if (component.position[0] < this.bounds[0]) {
                component.position[0] = this.bounds[0];
                component.velocity[0] = 0;
            } else if (component.position[0] > this.bounds[2]) {
                component.position[0] = this.bounds[2];
                component.velocity[0] = 0;
            }
            if (component.position[1] < this.bounds[1]) {
                component.position[1] = this.bounds[1];
                component.velocity[1] = 0;
            } else if (component.position[1] > this.bounds[3]) {
                component.position[1] = this.bounds[3];
                component.velocity[1] = 0;
            }
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
    getRandomVelocity() {
        return LA.rotate(LA.scale(
            LA.normalize([Math.random(), Math.random()]),
            MAX_VELOCITY * Math.random()
        ), this.getRandomAngle());
    }
    getRandomAngle() {
        return LA.TAU * Math.random();
    }
    getRandomAngularVelocity() {
        return (MAX_ANGULAR_VELOCITY - MIN_ANGULAR_VELOCITY)
            * Math.random()
            + MIN_ANGULAR_VELOCITY;
    }
    spawn(entity: Entity) {
        this.onEntityAdded(entity);
    }
    protected onEntityAdded(entity: Entity) {
        const mobility = entity.add(MobilityComponent);
        mobility.position = this.getRandomPoint();
        mobility.velocity = this.getRandomVelocity();
        mobility.angle = this.getRandomAngle();
        mobility.angularVelocity = this.getRandomAngularVelocity();
    }
}
