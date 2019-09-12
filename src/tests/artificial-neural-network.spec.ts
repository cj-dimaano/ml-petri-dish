/*******************************************************************************
@file artificial-neural-network.spec.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import ANN from "../artificial-neural-network";
import { expect } from "chai";
import "mocha";

describe("ArtificialNeuralNetwork", () => {
    describe("updateWeights", () => {
        const ann = new ANN(2, 2, [4, 4, 4]);

        for (let i = 0; i < 100000; i++) {
            const a = Math.random() < 0.5 ? 0 : 1;
            const b = Math.random() < 0.5 ? 0 : 1;
            const c = a & b ? 1 : 0;
            ann.updateWeights([a, b], [!c ? 1 : 0, c]);
        }

        it("should resemble `0 & 0`", () => {
            let outputs = ann.generateOutputs([0, 0]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);
        });
        it("should resemble `0 & 1`", () => {

            let outputs = ann.generateOutputs([0, 1]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);
        });
        it("should resemble `1 & 0`", () => {
            let outputs = ann.generateOutputs([1, 0]);
            expect(outputs[0]).greaterThan(0.9);
            expect(outputs[1]).lessThan(0.1);
        });
        it("should resemble `1 & 1`", () => {
            let outputs = ann.generateOutputs([1, 1]);
            expect(outputs[0]).lessThan(0.1);
            expect(outputs[1]).greaterThan(0.9);
        });
    });
});
