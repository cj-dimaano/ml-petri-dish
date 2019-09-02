/*******************************************************************************
@file system.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
@todo 
 - `components` member should have a size limit to prevent overflowing
 - need a better data structure for `components` to allow for removing elements
*******************************************************************************/

export default abstract class System<C> {
    constructor(private componentType: new () => C) { }
    components: C[] = [];
    /**
     * @param dt The amount of time passed since the previous update in
     *   franctions of a second.
     */
    abstract update(dt: number): void;
    addComponent(): C {
        const component: C = new this.componentType();
        this.components.push(component);
        this.onComponentCreated(component);
        return component;
    }
    protected onComponentCreated(component: C): void { }
}