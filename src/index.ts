/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";

window.addEventListener("load", () => {
    const game = new Game(
        (document.getElementById("game") as HTMLCanvasElement).getContext("2d")!,
        (document.getElementById("agent") as HTMLCanvasElement).getContext("2d")!
    );
    game.run();
});
