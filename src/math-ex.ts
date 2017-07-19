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
 *   Produces a new vector rotated by the given vector and radians.
 *
 * @param v
 *   The vector to be rotated.
 *
 * @param rad
 *   The number of radians to rotate the vector.
 */
export function rotate(v: vec2, rad: number): vec2 {
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return [v[0] * cos - v[1] * sin, v[0] * sin + v[1] * cos]
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

/**
 * @summary
 *   Rotates the given vector by the given number of radians. Rotation is
 *   performed in-place.
 *
 * @param v
 *   The vector to be rotated.
 *
 * @param rad
 *   The number of radians to rotate the vector.
 */
export function _rotate(v: vec2, rad: number): void {
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const v0 = v[0]
  const v1 = v[1]
  v[0] = v0 * cos - v1 * sin
  v[1] = v0 * sin + v1 * cos
}
