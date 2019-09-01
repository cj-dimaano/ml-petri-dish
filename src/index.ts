/*******************************************************************************
@file index.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import ANN from "./artificial-neural-network"

function testANN() {
    const ann = new ANN(2, 2, [4, 4, 4]);

    for (let i = 0; i < 1000000; i++) {
        const a = Math.random() < 0.5 ? 0 : 1;
        const b = Math.random() < 0.5 ? 0 : 1;
        const c = a & b ? 1 : 0;
        ann.updateWeights([a, b], [!c ? 1 : 0, c]);
    }

    // should output [high, low]
    console.log(ann.generateOutputs([0, 0]));

    // should output [high, low]
    console.log(ann.generateOutputs([0, 1]));

    // should output [high, low]
    console.log(ann.generateOutputs([1, 0]));

    // should output [low, high]
    console.log(ann.generateOutputs([1, 1]));
}
