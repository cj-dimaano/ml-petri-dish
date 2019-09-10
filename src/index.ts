/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";
import * as numeral from "numeral";

(() => {
    window.addEventListener("load", () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const game = new Game(canvas.getContext("2d")!);

        const durationElement = document.getElementById("duration")!;
        const trState = document.getElementById("state")!;

        const tdChoices = Array<HTMLElement>(6);
        for (let i = 0; i < tdChoices.length; i++)
            tdChoices[i] = document.getElementById(`choice${i}`)!;

        let prevTick = performance.now();
        const start = prevTick;
        const animation = (now: DOMHighResTimeStamp) => {
            durationElement.textContent = numeral((now - start) / 1000.0).format("00:00:00");
            game.update((now - prevTick) / 1000.0);
            game.draw();
            const state = game.agentAi.mem[0];
            for (let i = 0; i < state.length; i++) {
                if (trState.children.length < state.length)
                    trState.appendChild(document.createElement("td"));
                trState.children[i].textContent = numeral(state[i]).format("0.000");
            }
            for (let i = 0; i < tdChoices.length; i++) {
                tdChoices[i].children[0].textContent = numeral(game.agentAi.mem[1][i]).format("0.00000");
                tdChoices[i].children[1].textContent = numeral(game.agentAi.mem[2][i]).format("0.00000");
            }
            prevTick = now;
            requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    });
})();
