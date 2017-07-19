/*******************************************************************************
@file `math-ex.ts`
  Created July 18, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export type vec2 = [number, number]

export function dot(v: vec2, u: vec2): number {
  return v[0] * u[0] + v[1] * u[1]
}

export function magnitude(v: vec2): number {
  return Math.sqrt(dot(v, v))
}

/**
 * @summary
 *   Computes the normalized vector of `v`.
 *
 * @param v
 *   The vector to be normalized.
 */
export function normalize(v: vec2): vec2 {
  const mag = magnitude(v)
  return <vec2>v.map(value => value / mag)
}

export function scale(v: vec2, factor: number): vec2 {
  return <vec2>v.map(value => value * factor)
}

export function translate(v: vec2, u: vec2): vec2 {
  return [v[0] + u[0], v[1] + u[1]]
}

/**
 * @summary
 *   Scales the components of a vector by the given factor. Scaling is performed
 *   in-place.
 * 
 * @param v
 *   The vector to be scaled.
 * 
 * @param factor
 *   The scaling factor.
 */
export function _scale(v: vec2, factor: number): void {
  v[0] *= factor
  v[1] *= factor
}

/**
 * @summary
 *   Translates vector `v` by the vector `u`. Translation is performed in-place
 *   on `v`.
 * 
 * @param v
 *   The vector to be translated.
 *
 * @param u
 *   The vector values with which to translate.
 */
export function _translate(v: vec2, u: vec2): void {
  v[0] += u[0]
  v[1] += u[1]
}
