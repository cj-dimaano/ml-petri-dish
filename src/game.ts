/*******************************************************************************
@file game.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import MobilitySystem from "./systems/mobility.system";
import AgentEntity from "./entities/agent.entity";
import CollisionSystem from "./systems/collision.system";
import MobilityComponent from "./components/mobility.component";

export default class Game {
    constructor(private ctx: CanvasRenderingContext2D) {
        this.mobilitySystem = new MobilitySystem(ctx.canvas);
        this.collisionSystem = new CollisionSystem();

        this.agentEntity = new AgentEntity(
            this.mobilitySystem,
            this.collisionSystem
        );
        this.initInputHandlers();
    }

    get renderingContext() { return this.ctx; }

    /**
     * @param dt The amount of time passed since the previous update in
     *   franctions of a second.
     */
    update(dt: number) {
        this.mobilitySystem.update(dt);
        this.collisionSystem.update();
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.agentEntity.draw(this.ctx);
    }

    private mobilitySystem: MobilitySystem;
    private collisionSystem: CollisionSystem;

    private agentEntity: AgentEntity;

    private initInputHandlers() {
        const agentMobility = this.agentEntity.get(MobilityComponent);
        window.addEventListener("keydown", (evt) => {
            switch (evt.key) {
                case "ArrowLeft":
                    agentMobility.angularAcceleration = 10;
                    break;

                case "ArrowRight":
                    agentMobility.angularAcceleration = -10;
                    break;

                case "ArrowUp":
                    agentMobility.acceleration = 2;
                    break;
            }
        });
        window.addEventListener("keyup", (evt) => {
            switch (evt.key) {
                case "ArrowLeft":
                    agentMobility.angularAcceleration = 0;
                    break;

                case "ArrowRight":
                    agentMobility.angularAcceleration = 0;
                    break;

                case "ArrowUp":
                    agentMobility.acceleration = 0;
                    break;
            }
        });
    }
}
