/*******************************************************************************
@file ui.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/
import * as numeral from "numeral";

export default class UI {
	constructor(private startTimeStamp: DOMHighResTimeStamp) {
		this.wakeCountDOM = document.querySelector("#wake_count")!;
		this.runtimeDOM = document.querySelector("#duration")!;
		this.bubbleCountDOM = document.querySelector("#bubble_count")!;

		this.actionRotateCCWDOM = document.querySelector("#action__rotate_ccw")!;
		this.actionAccelerateDOM = document.querySelector("#action__accelerate")!;
		this.actionRotateCWDOM = document.querySelector("#action__rotate_cw")!;
	}

	private wakeCountDOM: Element;
	private runtimeDOM: Element;
	private bubbleCountDOM: Element;

	private actionRotateCCWDOM: Element;
	private actionAccelerateDOM: Element;
	private actionRotateCWDOM: Element;

	// @todo: state DOM

	updateWakeCount(value: number) {
		this.wakeCountDOM.textContent = `${value}`;
	}

	updateRuntime(now: DOMHighResTimeStamp) {
		this.runtimeDOM.textContent = `${numeral((now - this.startTimeStamp) / 1000.0).format("00:00:00")}`;
	}

	updateBubbleCount(value: number) {
		this.bubbleCountDOM.textContent = `${value}`;
	}

	updateAction(isRotatingCCW: boolean, isAccelerating: boolean, isRotatingCW: boolean) {
		this.actionRotateCCWDOM.classList.toggle("action__inactive", !isRotatingCCW);
		this.actionAccelerateDOM.classList.toggle("action__inactive", !isAccelerating);
		this.actionRotateCWDOM.classList.toggle("action__inactive", !isRotatingCW);
	}
}