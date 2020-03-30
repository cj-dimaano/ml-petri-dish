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
import { getEnvironmentStateFromEntity } from "./environment-state";
import * as LA from "./linear-algebra";

const BUBBLE_POPULATION = 30;
export const FRAME_DT_S = 1.0 / 60.0;

export default class Game {
    constructor(
        private environmentCtx: CanvasRenderingContext2D,
        private agentCtx: CanvasRenderingContext2D
    ) {
        this.mobilitySystem = new MobilitySystem(environmentCtx.canvas);
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

    get renderingContext() { return this.environmentCtx; }

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
            ui.updateWakeCount(this.agentAi.wakeCount);
            ui.updateRuntime(now);
            ui.updateAction(
                this.agentMobility.angularAcceleration < 0,
                this.agentMobility.acceleration > 0,
                this.agentMobility.angularAcceleration > 0
            );
            ui.updateState(getEnvironmentStateFromEntity(this.agentEntity));
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
        ((g, b, a) => {
            g.clearRect(0, 0, g.canvas.width, g.canvas.height);
            b.forEach(bubble => bubble.draw(g));
            a.draw(g);
        })(this.environmentCtx, this.bubbleEntities, this.agentEntity);

        ((g, s) => {
            const [w, h] = [g.canvas.width, g.canvas.height];
            g.clearRect(0, 0, w, h);

            const w2 = w / 2;
            const u = LA.normalize([s.x, s.y]);
            const bw = Math.abs((1 - LA.magnitude([s.x, s.y]) / 100) * w2); // 100 === vision radius
            const bx = w * Math.atan2(u[0], -u[1]) / LA.TAU;
            g.strokeStyle = "blue";
            g.fillStyle = "blue";
            g.fillRect(bx, 0, bw, h);
            g.strokeRect(bx, 0, bw, h);
            g.fillRect(bx - w, 0, bw, h);
            g.strokeRect(bx - w, 0, bw, h);
            g.fillRect(bx + w, 0, bw, h);
            g.strokeRect(bx + w, 0, bw, h);

            g.strokeStyle = "rgba(0,0,0,0.2)";
            g.beginPath();
            g.moveTo(w / 2, h);
            g.lineTo(w / 2, 0);
            g.stroke();
        })(this.agentCtx, getEnvironmentStateFromEntity(this.agentEntity));
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
