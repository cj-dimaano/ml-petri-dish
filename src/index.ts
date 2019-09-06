/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import Game from "./game";
import * as moment from "moment";
import * as numeral from "numeral";

import * as LA from "./linear-algebra";
import ANN from "./artificial-neural-network";

(() => {
    // [state, choice, reward]
    type memory = [number[], number, number];

    const MAX_DIM = 30;


    const dom = new Map<string, HTMLElement>();
    function saveDomElements(...ids: string[]) {
        ids.forEach(id => dom.set(id, document.getElementById(id)!));
    }

    const tdChoices = Array(6);
    function saveChoicesDomElements() {
        for (let i = 0; i < tdChoices.length; i++)
            tdChoices[i] = document.getElementById(`choice${i}`)!;
    }

    function setupGrid(grid: HTMLElement) {
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

    function clearGrid(grid: HTMLElement) {
        for (const tr of grid.children) {
            for (const td of tr.children)
                td.className = "";
        }
    }

    function getCell(v: number[]): HTMLElement {
        return document.getElementById(`r${v[0]}c${v[1]}`)!;
    }

    function updateTdChoices(Qa: number[], Qb: number[]) {
        for (let i = 0; i < Qa.length; i++) {
            // tdChoices[i].textContent
            //     = `${Qa[i]}, ${Qb[i]}`;
            tdChoices[i].children[0].children[0].value = Qa[i];
            tdChoices[i].children[1].children[0].value = Qb[i];
        }
    }

    function updateDuration(timespan: number) {
        // dom.get("duration")!.textContent = moment.duration(timespan).humanize();
        dom.get("duration")!.textContent = numeral(-timespan / 1000).format("00:00:00");
    }

    function getState(v: number[], u: number[], a: number) {
        return [...v, ...u, a];
    }

    function clip(val: number, min: number, max: number) {
        return Math.min(Math.max(val, min), max);
    }


    window.addEventListener("load", () => {
        saveDomElements("grid", "episode", "duration");
        saveChoicesDomElements();
        setupGrid(dom.get("grid")!);


        /*
        # double q-learning
        https://en.wikipedia.org/wiki/Q-learning#Double_Q-learning
        https://www.analyticsvidhya.com/blog/2019/04/introduction-deep-q-learning-python/
        https://towardsdatascience.com/self-learning-ai-agents-part-ii-deep-q-learning-b5ac60c3f47
        */
        let angle = 0
        let a: number[] = [];
        let b: number[] = [];
        // [state_t, action_t, reward_(t+1)]
        const mem: memory[] = [];
        // policy a and b
        const Pa = new ANN(5, 6, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
        const Pb = new ANN(5, 6, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);


        function argMax(options: number[]): number {
            return options.reduce((p, c, i, a) => a[p] < c ? i : p, 0);
        }

        function roulette(options: number[]): number {
            const sum = options.reduce((p, c) => p + c);
            let roulette = Math.random() * sum;
            return options.findIndex(v => {
                roulette -= v;
                return roulette <= 0;
            });
        }

        function makeChoice(Qa: number[], Qb: number[]): number {
            /*
            "clipped double-q"
            https://towardsdatascience.com/double-deep-q-networks-905dd8325412
            */
            let a = 0;
            let b = 0;

            if (Math.random() < 10 / (10 + episode)) {
                /* roulette */
                a = roulette(Qa);
                b = roulette(Qb);
            } else {
                /* greedy */
                a = argMax(Qa);
                b = argMax(Qb);
            }
            return Qa[a] < Qb[b] ? a : b;
        }

        function updateState(choice: number) {
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
        }


        let memBatch: number = 0;
        let dream: memory[] = [];
        function updateWeights() {
            if (memBatch < 20) {
                if (dream.length > 1) {
                    // https://en.wikipedia.org/wiki/Q-learning#Double_Q-learning
                    const m = dream.shift()!;
                    const r = dream[0][2];
                    const nextState = dream[0][0];

                    const Qa = Pa.generateOutputs(m[0]);
                    const Qb = Pb.generateOutputs(m[0]);

                    const mChoiceA = Qa[m[1]];
                    const mChoiceB = Qb[m[1]];

                    const discountFactor = 0.5;

                    Qa[m[1]]
                        = mChoiceA
                        + Pa.learningRate
                        * (
                            r
                            + discountFactor
                            * argMax(Pb.generateOutputs(nextState))
                            - mChoiceA
                        );
                    Qb[m[1]]
                        = mChoiceB
                        + Pb.learningRate
                        * (
                            r
                            + discountFactor
                            * argMax(Pa.generateOutputs(nextState))
                            - mChoiceB
                        );

                    Pa.updateWeights(m[0], Qa);
                    Pb.updateWeights(m[0], Qb);
                } else {
                    const batchSize = Math.max(mem.length * 0.05, 2);
                    const memStart = Math.floor(Math.random() * (mem.length - batchSize));
                    dream = mem.slice(memStart, memStart + batchSize);
                }
                memBatch++;
                setTimeout(() => {
                    updateDuration(start - performance.now());
                    updateWeights();
                }, 0);
            }
            else {
                mem.length = 0;
                dream.length = 0;
                setTimeout(() => {
                    updateDuration(start - performance.now());
                    updateEpisode();
                }, 0);
            }
        }


        let steps: number | undefined = undefined;
        // let minSteps = MAX_DIM * MAX_DIM;
        function updateGame() {
            // steps++;

            // get Q predictions
            const state = getState(a, b, angle);
            const Qa = Pa.generateOutputs(state);
            const Qb = Pb.generateOutputs(state);

            // @todo research choice selection techniques
            const choice = makeChoice(Qa, Qb);
            // const choice = makeChoice(Qa);
            console.assert(choice >= 0 && choice < Qa.length);
            updateTdChoices(Qa, Qb);

            // update angle
            updateState(choice);

            // save memory
            mem.push([state, choice, 0]);

            if (a[0] === b[0] && a[1] === b[1]) {
                // @todo
                // use `minSteps / steps` as reward val
                mem.push([getState(a, b, angle), 0, (steps === undefined ? mem.length : steps) / mem.length]);
                steps = mem.length;
                // mem.push([getState(a, b, angle), 0, minSteps / mem.length]);
                console.log(mem.length);
                // console.log(steps);
                memBatch = 0;
                // minSteps = Math.min(minSteps, mem.length);
                setTimeout(() => {
                    updateDuration(start - performance.now());
                    updateWeights();
                }, 0);
            }
            else {
                setTimeout(() => {
                    updateDuration(start - performance.now());
                    updateGame();
                }, 0);
            }
        }


        let episode = 0;
        function updateEpisode() {
            clearGrid(dom.get("grid")!);
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
            // angle = Math.floor(Math.random() * 4); /* north, east, west, south */
            angle = 0;
            mem.length = 0;
            mem.push([getState(a, b, angle), 0, 0]);
            // steps = 0;
            episode++;
            dom.get("episode")!.textContent = numeral(episode).format("0,0");

            // if (episode < 1000) {
            getCell(b).classList.add("destination");
            getCell(a).classList.add("visited", "active");
            setTimeout(() => {
                updateDuration(start - performance.now());
                updateGame();
            }, 0);
            // }
        }

        const start = performance.now();
        setTimeout(() => {
            updateDuration(start - performance.now());
            updateEpisode();
        }, 0);
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