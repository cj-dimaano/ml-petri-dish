/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const game = new Game(canvas.getContext("2d")!);
    let prevTick = performance.now();
    const animation = (now: DOMHighResTimeStamp) => {
        game.update((now - prevTick) / 1000.0);
        game.draw();
        prevTick = now;
        requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
});