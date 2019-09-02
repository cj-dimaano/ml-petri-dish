/*******************************************************************************
@file linear-algebra.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/


/**
 * @brief Calculates the dot product of two vectors.
 * @param v The left vector.
 * @param u The right vector.
 */
export function dot(v: number[], u: number[]): number {
    console.assert(v.length === u.length);
    return v.reduce((prev, curr, index) => prev + curr * u[index]);
}

export function magnitude(v: number[]): number {
    return Math.sqrt(dot(v, v));
}

export function scale(v: number[], s: number): number[] {
    return v.map(value => value * s);
}

export function normalize(v: number[]): number[] {
    return scale(v, 1 / magnitude(v));
}

/**
 * @brief Rotates a 2d vector.
 * @param v The 2d vector to be rotated.
 * @param rad The number of radians to rotate.
 */
export function rotate(v: number[], rad: number): number[] {
    console.assert(v.length === 2);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const a = v[0];
    const b = v[1];
    return [a * cos + b * sin, b * cos - a * sin];
}