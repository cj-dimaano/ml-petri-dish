/*******************************************************************************
@file artificial-neural-network.spec.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import ANN from "../artificial-neural-network";
import { expect } from "chai";
import "mocha";

describe("ArtificialNeuralNetwork", () => {
    describe("updateWeights", () => {
        it("should resemble bitwise AND operator", () => {
            const ann = new ANN(2, 2, [4, 4, 4]);

            for (let i = 0; i < 100000; i++) {
                const a = Math.random() < 0.5 ? 0 : 1;
                const b = Math.random() < 0.5 ? 0 : 1;
                const c = a & b ? 1 : 0;
                ann.updateWeights([a, b], [!c ? 1 : 0, c]);
            }

            let outputs = ann.generateOutputs([0, 0]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);

            outputs = ann.generateOutputs([0, 1]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);

            outputs = ann.generateOutputs([1, 0]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);

            outputs = ann.generateOutputs([1, 1]);
            expect(outputs[0]).lessThan(0.1);
            expect(outputs[1]).greaterThan(0.9);
        })
    });
});
