/*******************************************************************************
@file game.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import MobilitySystem from "./systems/mobility.system";
import AgentEntity from "./entities/agent.entity";
import CollisionSystem from "./systems/collision.system";
import MobilityComponent from "./components/mobility.component";
import BubbleEntity from "./entities/bubble.entity";
import ConsumerSystem from "./systems/consumer.system";
import TargetSystem from "./systems/target.system";
import ArtificialIntelligenceSystem from "./systems/artificial-intelligence.system";
import ArtificialIntelligenceComponent from "./components/artificial-intelligence.component";

export default class Game {
    constructor(private ctx: CanvasRenderingContext2D) {
        this.mobilitySystem = new MobilitySystem(ctx.canvas);
        this.collisionSystem = new CollisionSystem();
        this.consumerSystem = new ConsumerSystem(this.mobilitySystem);
        this.targetSystem = new TargetSystem(this.mobilitySystem);
        this.aiSystem = new ArtificialIntelligenceSystem();

        this.agentEntity = new AgentEntity(
            this.mobilitySystem,
            this.collisionSystem,
            this.consumerSystem,
            this.targetSystem,
            this.aiSystem
        );
        for (let i = 0; i < 30; i++) {
            this.bubbleEntities.push(new BubbleEntity(
                this.mobilitySystem,
                this.collisionSystem
            ));
        }
        // this.initInputHandlers();
    }

    get renderingContext() { return this.ctx; }

    /**
     * @param dt The amount of time passed since the previous update in
     *   franctions of a second.
     */
    update(dt: number) {
        this.mobilitySystem.update(dt);
        this.targetSystem.update();
        this.collisionSystem.update();
        this.aiSystem.update(dt);
        this.consumerSystem.update();
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.bubbleEntities.forEach(bubble => bubble.draw(this.ctx));
        this.agentEntity.draw(this.ctx);

        this.ctx.strokeStyle = "black";
        this.ctx.strokeText(
            `${this.agentEntity.get(ArtificialIntelligenceComponent).score}`,
            10, 10
        );
    }

    private mobilitySystem: MobilitySystem;
    private collisionSystem: CollisionSystem;
    private consumerSystem: ConsumerSystem;
    private targetSystem: TargetSystem;
    private aiSystem: ArtificialIntelligenceSystem;

    private agentEntity: AgentEntity;
    private bubbleEntities: BubbleEntity[] = [];

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
