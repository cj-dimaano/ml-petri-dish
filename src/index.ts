/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";

(() => {
    window.addEventListener("load", () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const game = new Game(canvas.getContext("2d")!);
        game.run();

        // const durationElement = document.getElementById("duration")!;
        // const trState = document.getElementById("state")!;

        // const tdChoices = Array<HTMLElement>(6);
        // for (let i = 0; i < tdChoices.length; i++)
        //     tdChoices[i] = document.getElementById(`choice${i}`)!;

        // let prevTick = performance.now();
        // const start = prevTick;
        // const animation = (now: DOMHighResTimeStamp) => {
        //     durationElement.textContent = numeral((now - start) / 1000.0).format("00:00:00");
        //     game.update((now - prevTick) / 1000.0);
        //     game.draw();
        //     const mem = game.agentAi.mem;
        //     const state = mem[mem.length - 1][0];
        //     for (let i = 0; i < state.length; i++) {
        //         if (trState.children.length < state.length)
        //             trState.appendChild(document.createElement("td"));
        //         trState.children[i].textContent = numeral(state[i]).format("0.000");
        //     }
        //     const Qa = game.agentAi.Pa.generateOutputs(state);
        //     const Qb = game.agentAi.Pb.generateOutputs(state);
        //     for (let i = 0; i < tdChoices.length; i++) {
        //         tdChoices[i].children[0].textContent = numeral(Qa[i]).format("0.00000");
        //         tdChoices[i].children[1].textContent = numeral(Qb[i]).format("0.00000");
        //     }
        //     prevTick = now;
        //     requestAnimationFrame(animation);
        // };
        // requestAnimationFrame(animation);
    });
})();
