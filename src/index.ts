/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";
import * as moment from "moment";

import ANN from "./artificial-neural-network";
import * as numeral from "numeral";

(() => {

    window.addEventListener("load", () => {
        const MAX_DIM = 30;
        const getState = (v: number[], u: number[], a: number) => [...v, ...u, a];
        const clip = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
        const grid = document.getElementById("grid")! as HTMLTableElement;
        const episodeElement = document.getElementById("episode")!;
        const durationElement = document.getElementById("duration")!;
        const tdChoices = Array(6);
        for (let i = 0; i < tdChoices.length; i++)
            tdChoices[i] = document.getElementById(`choice${i}`)!;
        setupGrid(grid);


        function setupGrid(grid: HTMLTableElement) {
            for (let r = 0; r < MAX_DIM; r++) {
                const tr = document.createElement("tr");
                for (let c = 0; c < MAX_DIM; c++) {
                    const td = document.createElement("td");
                    td.id = `r${r}c${c}`;
                    tr.append(td);
                }
                grid.append(tr);
            }
        }

        function clearGrid(grid: HTMLTableElement) {
            for (const tr of grid.children) {
                for (const td of tr.children) {
                    td.className = "";
                }
            }
        }

        function getCell(v: number[]): HTMLElement {
            return document.getElementById(`r${v[0]}c${v[1]}`)!;
        }

        let episode = 0;
        let angle = 0
        let a: number[] = [];
        let b: number[] = [];
        let state = [];
        let mem: [number[], number[], number] = [[], [], 0];
        let steps = 0;
        const ann = new ANN(5, 6, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);

        function makeChoice(options: number[]): number {
            // if (Math.random() < episode / (10 + episode)) {
            const sum = options.reduce((p, c) => p + c);
            let roulette = Math.random() * sum;
            return options.findIndex(v => {
                roulette -= v;
                return roulette <= 0;
            });
            // }
            // else
            //     return Math.max(...options);
        }

        function updateWeights() {
            durationElement.textContent =
                moment.duration(start - performance.now()).humanize();
            steps++;

            state = getState(a, b, angle);
            const outputs = ann.generateOutputs(state);
            const choice = makeChoice(outputs);
            console.assert(choice >= 0 && choice < outputs.length);
            for (let i = 0; i < outputs.length; i++)
                tdChoices[i].textContent = numeral(outputs[i]).format("0.000");

            if (choice === 1 || choice === 4)
                angle = (angle - 1 + 4) % 4;
            else if (choice === 2 || choice === 5)
                angle = (angle + 1 + 4) % 4;

            getCell(a).classList.toggle("active", false);
            if (choice > 2) {
                switch (angle) {
                    case 0: a[1]--; break;
                    case 1: a[0]--; break;
                    case 2: a[1]++; break;
                    case 3: a[0]++; break;
                }
                a[0] = clip(a[0], 0, MAX_DIM - 1);
                a[1] = clip(a[1], 0, MAX_DIM - 1);
            }
            getCell(a).classList.add("visited", "active");

            const maxQ = outputs.reduce((p, c) => Math.max(p, c));
            const t = [...mem[1]];
            t[mem[2]] = (1 - ann.learningRate) * t[mem[2]]
                + ann.learningRate * (
                    (a[0] === b[0] && a[1] === b[1] ? 1 : 0) /* reward for step */
                    + (episode / (1 + episode)) /* discount factor (reward decay) */
                    * maxQ
                );
            ann.updateWeights(mem[0], t);

            mem[0] = state;
            mem[1] = outputs;
            mem[2] = choice;

            if (a[0] === b[0] && a[1] === b[1]) {
                console.log(steps);
                setTimeout(updateEpisode, 0);
            }
            else
                setTimeout(updateWeights, 0);
        }

        function updateEpisode() {
            clearGrid(grid)
            a = [
                // Math.floor(Math.random() * MAX_DIM),
                // Math.floor(Math.random() * MAX_DIM)
                0, 0
            ];
            b = [
                // Math.floor(Math.random() * MAX_DIM),
                // Math.floor(Math.random() * MAX_DIM)
                MAX_DIM - 1, MAX_DIM - 1
            ];
            angle = Math.floor(Math.random() * 4); /* north, east, west, south */
            state = getState(a, b, angle);
            mem = [state, ann.generateOutputs(state), 0];
            steps = 0;
            episode++;
            episodeElement.textContent = numeral(episode).format("0,0");

            // if (episode < 1000) {
            getCell(b).classList.add("destination");
            getCell(a).classList.add("visited", "active");
            setTimeout(updateWeights, 0);
            // }
        }

        const start = performance.now();
        setTimeout(updateEpisode, 0);
    });
})();

// window.addEventListener("load", () => {
//     const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//     const game = new Game(canvas.getContext("2d")!);
//     const durationElement = document.getElementById("duration")!;
//     let prevTick = performance.now();
//     const start = prevTick;
//     const animation = (now: DOMHighResTimeStamp) => {
//         durationElement.textContent = moment.duration(start - now).humanize();
//         game.update((now - prevTick) / 1000.0);
//         game.draw();
//         prevTick = now;
//         requestAnimationFrame(animation);
//     };
//     requestAnimationFrame(animation);
// });