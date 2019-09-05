/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";
import * as moment from "moment";

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const game = new Game(canvas.getContext("2d")!);
    const durationElement = document.getElementById("duration")!;
    let prevTick = performance.now();
    const start = prevTick;
    const animation = (now: DOMHighResTimeStamp) => {
        durationElement.textContent = moment.duration(start - now).humanize();
        game.update((now - prevTick) / 1000.0);
        game.draw();
        prevTick = now;
        requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
});