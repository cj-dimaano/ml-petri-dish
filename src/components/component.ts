/*******************************************************************************
@file component.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export default class Component {
    constructor(public readonly type: new () => Component) { }
}