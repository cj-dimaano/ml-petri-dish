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
import UI from "./ui";

const BUBBLE_POPULATION = 30;
export const FRAME_DT_S = 1.0 / 60.0;

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
        for (let i = 0; i < this.bubbleEntities.length; ++i) {
            this.bubbleEntities[i] = new BubbleEntity(
                this.mobilitySystem,
                this.collisionSystem
            );
        }

        this.agentAi = this.agentEntity.get(ArtificialIntelligenceComponent);
        this.agentMobility = this.agentEntity.get(MobilityComponent);
        // this.initInputHandlers();
    }

    agentAi: ArtificialIntelligenceComponent;
    agentMobility: MobilityComponent;

    get renderingContext() { return this.ctx; }

    run() {
        const FRAME_DT_MS = FRAME_DT_S * 1000.0;
        let prevTick = performance.now();
        const ui = new UI(prevTick);
        const nextFrame = (now: DOMHighResTimeStamp) => {
            while (now - prevTick >= FRAME_DT_MS) {
                this.update();
                prevTick += FRAME_DT_MS;
            }
            ui.updateBubbleCount(this.agentAi.score);
            // @todo
            //   update wake count
            ui.updateWakeCount(0);
            ui.updateRuntime(now);
            ui.updateAction(
                this.agentMobility.angularAcceleration < 0,
                this.agentMobility.acceleration > 0,
                this.agentMobility.angularAcceleration > 0
            );
            this.draw();

            requestAnimationFrame(nextFrame);
        }
        requestAnimationFrame(nextFrame);
    }

    /**
     * @remarks
     *   Game runs on a fixed frame rate to simplify updates
     */
    private update() {
        this.mobilitySystem.update();
        this.targetSystem.update();
        this.collisionSystem.update();
        this.aiSystem.update();
        this.consumerSystem.update();
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.bubbleEntities.forEach(bubble => bubble.draw(this.ctx));
        this.agentEntity.draw(this.ctx);
    }

    private mobilitySystem: MobilitySystem;
    private collisionSystem: CollisionSystem;
    private consumerSystem: ConsumerSystem;
    private targetSystem: TargetSystem;
    private aiSystem: ArtificialIntelligenceSystem;

    private agentEntity: AgentEntity;
    private bubbleEntities: BubbleEntity[] = Array<BubbleEntity>(BUBBLE_POPULATION);

    initInputHandlers() {
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
