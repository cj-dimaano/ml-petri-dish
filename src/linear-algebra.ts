/*******************************************************************************
@file linear-algebra.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export const TAU = 2 * Math.PI;

/**
 * @brief Calculates the dot product of two vectors.
 */
export function dot(v: number[], u: number[]): number {
    console.assert(v.length === u.length);
    return v.reduce((p, _, i) => p + v[i] * u[i], 0);
}

export function magnitude(v: number[]): number {
    return Math.sqrt(dot(v, v));
}

export function scale(v: number[], s: number): number[] {
    return v.map(value => value * s);
}

export function normalize(v: number[]): number[] {
    const mag = magnitude(v);
    return scale(v, 1 / (mag === 0 ? 1 : mag));
}

export function sum(v: number[], ...u: number[][]): number[] {
    return u.reduce((p: number[], c: number[]) => {
        console.assert(p.length === c.length);
        return p.map((_, i) => p[i] + c[i]);
    }, v);
}

export function difference(v: number[], ...u: number[][]): number[] {
    return u.reduce((p: number[], c: number[]) => {
        console.assert(p.length === c.length);
        return p.map((_, i) => p[i] - c[i]);
    }, v);
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
    const v0 = v[0];
    const v1 = v[1];
    return [v0 * cos + v1 * sin, v1 * cos - v0 * sin];
}