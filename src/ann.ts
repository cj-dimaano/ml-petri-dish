/*******************************************************************************
@file `ann.ts`
  Created July 22, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export class ANN {
  /**
   * 
   * @param featureCount
   *   The number of features per example, not including the bias.
   * 
   * @param hiddenLayers
   *   The number of hidden layers in the network.
   *
   * @param nodesPerLayer
   *   The number of features per hidden layer, not including the bias.
   *
   * @param outputCount
   *   The number of outputs of the network.
   * 
   * @param gamma0
   *   Training hyper parameter.
   */
  constructor(
    featureCount: number,
    hiddenLayers: number,
    nodesPerLayer: number,
    outputCount: number,
    private gamma0: number = 0.95
  ) {
    this.appendLayer(
      featureCount,
      hiddenLayers > 0 ? nodesPerLayer : outputCount
    )
    for (let i = 1; i < hiddenLayers; i++)
      this.appendLayer(nodesPerLayer, nodesPerLayer)
    if (hiddenLayers > 0) {
      this.appendLayer(nodesPerLayer, outputCount)
    }
  }
  private w: number[][][] = []
  private z: number[][] = []
  /**
   * @summary
   *   Picks an action based on the input features.
   * 
   * @param features
   *   Environment features.
   * 
   * @returns
   *   The output vector with a bias feature at the 0-index.
   */
  chooseAction(features: number[]): number[] {
    const w = this.w;
    const z: number[][] = [[1, ...features]]
    let current = z[0]
    for (const layer of w) {
      const next: number[] = [1]
      for (const weights of layer) {
        console.assert(weights.length === current.length,
          "error `ANN.chooseAction`: vector lengths do not match")
        const dot = weights.reduce(
          (sum, value, index) => sum + value * current[index]
        )
        next.push(1 / (1 + Math.exp(-dot)))
      }
      z.push(next)
      current = next
    }
    this.z = z
    return current
  }
  updateWeights(dLy: number): void {
    const w: number[][][] = []
    for (let l = this.w.length; l > 0; l--) {
      this.z[l] = this.z[l].map((value) => value * (1 - value))
      const layer = this.w[l - 1]
      const newLayer: number[][] = []
      for (let r = 0; r < layer.length; r++) {
        const row = layer[r]
        newLayer.push(row.map(
          (value, index) => {
            return value - this.gamma0 * dLy * this.propagate(l - 1, r, index)
          }))
      }
      w.unshift(newLayer)
    }
    this.w = w
  }
  private propagate(l: number, n: number, j: number): number {
    let result = 0
    console.assert(j < this.z[l].length,
      `error \`ANN.propagate\`: j out of bounds.`)
    const z = this.z[l][j]
    if (l + 1 < this.w.length) {
      const nextLayer = this.w[l + 1]
      for (let n1 = 0; n1 < nextLayer.length; n1++)
        result += z * nextLayer[n1][n + 1] * this.propagate(l + 1, n1, n + 1)
    } else
      result = z
    return result
  }
  private appendLayer(inputCount: number, outputCount: number): void {
    const layer: number[][] = []
    for (let i = 0; i < outputCount; i++) {
      const row: number[] = []
      for (let j = 0; j <= inputCount; j++)
        row.push(1 - 2 * Math.random())
      layer.push(row)
    }
    this.w.push(layer)
  }
}
