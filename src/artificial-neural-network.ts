/*******************************************************************************
@file artificial-neural-network.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

import { dot } from "./linear-algebra";

export default class ArtificialNeuralNetwork {
  /**
   * @param inputCount The number of feature inputs.
   * @param outputCount The number of output values.
   * @param hiddenLayers An array indicating the number of result nodes at each
   *   intermediate layer.
   * @remarks `inputCount` should exclude the bias.
   */
  constructor(
    inputCount: number,
    outputCount: number,
    hiddenLayers: number[] = []
  ) {
    hiddenLayers.push(outputCount);
    let a = inputCount;
    const w: number[][][] = Array(hiddenLayers.length);
    for (let l = 0; l < hiddenLayers.length; ++l) {
      const b = hiddenLayers[l];
      w[l] = this.makeNeuralNetLayer(a, b);
      a = b;
    }
    this.weights = w;
  }

  /**
   * @remarks Must be positive.
   */
  learningRate: number = 0.2;

  /**
   * @brief Generates the output values from the given input features.
   * @param x The feature input values.
   * @remarks The feature inputs should exclude the bias.
   */
  generateOutputs(x: number[]): number[] {
    let outputs = this.computeNodes(x).pop()!;
    console.assert(!!outputs);
    outputs.shift();
    return outputs;
  }

  /**
   * @brief Uses backpropagation to update the weights of the neural net.
   * @param x The feature input values.
   * @param t The target output values.
   * @remarks The feature inputs should exclude the bias.
   */
  updateWeights(x: number[], t: number[]) {
    const net = this.computeNodes(x);
    const weightsNew = this.weights;
    const weightsOld = this.copyWeights();
    const gradient: number[][] = Array(net.length);
    // shift 1 to account for the computNodes output layer
    t.unshift(1);

    console.assert(net.length === weightsOld.length + 1);

    /* https://en.wikipedia.org/wiki/Backpropagation#Derivation_for_a_single-layered_network */
    for (let l = weightsOld.length; l > 0; --l) {
      const layer = net[l];
      gradient[l] = Array(layer.length);
      for (let j = 0; j < layer.length; ++j) {
        const activationDerivitive = logisticDerivitive(layer[j]);
        if (l === weightsOld.length) {
          gradient[l][j] = (layer[j] - t[j]) * activationDerivitive;
        } else {
          const next = gradient[l + 1];
          let sum = 0;
          // start at 1 to account for the bias
          for (let o = 1; o < next.length; ++o) {
            // calculate the sum for intermediate node gradient
            sum += weightsOld[l][o - 1][j] * next[o];
            // update live weight
            weightsNew[l][o - 1][j] -= this.learningRate * layer[j] * next[o];
          }
          gradient[l][j] = sum * activationDerivitive;
        }
      }
    }
  }

  private weights: number[][][];

  private copyWeights(): number[][][] {
    const copy: number[][][] = Array(this.weights.length);
    for (let l = 0; l < copy.length; ++l) {
      const layer = Array(this.weights[l].length);
      for (let w = 0; w < layer.length; ++w) {
        layer[w] = [...this.weights[l][w]];
      }
      copy[l] = layer;
    }
    return copy;
  }

  private computeNodes(x: number[]): number[][] {
    const nodes: number[][] = Array(this.weights.length + 1);
    nodes[0] = [1, ...x];
    for (let l = 0; l < this.weights.length; ++l) {
      const layer = this.weights[l];
      const v = nodes[l];
      const u = Array(layer.length + 1);
      u[0] = 1;
      for (let w = 0; w < layer.length; ++w)
        u[w + 1] = this.activate(v, layer[w]);
      nodes[l + 1] = u;
    }
    return nodes;
  }

  private activate(v: number[], u: number[]): number {
    /*
    We are using the logistic function because the inputs contain both positive
    and negative values.
    */
    return logistic(dot(v, u));
  }

  private makeNeuralNetLayer(
    inputCount: number,
    outputCount: number): number[][] {
    const layer = Array<number[]>(outputCount);
    inputCount += 1; // +1 to account for the bias
    for (let j = 0; j < outputCount; ++j) {
      const v = Array<number>(inputCount);
      for (let i = 0; i < inputCount; ++i) {
        let w = 0;
        while (w === 0)
          w = Math.random() * 2 - 1;
        v[i] = w;
      }
      layer[j] = v;
    }
    return layer;
  }
}

/**
 * @brief Calculates the logistic value of the current node.
 * @param z The dot product of the weights and nodes of the previous layer.
 */
function logistic(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * @brief Calculates the derivitive of the logistic function.
 * @param l The result of the logistic function.
 */
function logisticDerivitive(l: number): number {
  return l * (1 - l);
}