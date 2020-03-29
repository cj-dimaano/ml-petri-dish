/*******************************************************************************
@file ui.ts
@author CJ Dimaano <c.j.s.dimaano@gmail.com>
*******************************************************************************/
import * as numeral from "numeral";
import { getStateKeyOrder } from "./environment-state";

export default class UI {
	constructor(private startTimeStamp: DOMHighResTimeStamp) {
		this.wakeCountDOM = document.querySelector("#wake_count")!;
		this.runtimeDOM = document.querySelector("#duration")!;
		this.bubbleCountDOM = document.querySelector("#bubble_count")!;

		this.actionRotateCCWDOM = document.querySelector("#action__rotate_ccw")!;
		this.actionAccelerateDOM = document.querySelector("#action__accelerate")!;
		this.actionRotateCWDOM = document.querySelector("#action__rotate_cw")!;

		this.environmentStateDOM = document.querySelector("#agent_environment")!;
	}

	private wakeCountDOM: Element;
	private runtimeDOM: Element;
	private bubbleCountDOM: Element;

	private actionRotateCCWDOM: Element;
	private actionAccelerateDOM: Element;
	private actionRotateCWDOM: Element;

	private environmentStateDOM: Element;
	private statePropertyDOMMap: Map<symbol | string, Element> =
		new Map<symbol | string, Element>();

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

	updateState(state: any) {
		if ((() => {
			for (const key in state) {
				if (!this.statePropertyDOMMap.has(key))
					return true;
			}
			for (const key of this.statePropertyDOMMap.keys()) {
				if (!(key in state))
					return true;
			}
			return false;
		})()) {
			this.statePropertyDOMMap.clear();
			this.environmentStateDOM.textContent = "";
			for (const key of getStateKeyOrder()) {
				const tr = document.createElement("tr");
				const tdKey = document.createElement("td");
				const tdVal = document.createElement("td");
				tdKey.className = "state__key";
				tdKey.textContent = key;
				tdVal.className = "state__value";
				tr.append(tdKey, tdVal);
				this.environmentStateDOM.append(tr);
				this.statePropertyDOMMap.set(key, tdVal);
			}
		}
		for (const key in state) {
			const val = Math.abs(state[key]) < 0.001 ? 0 : state[key];
			this.statePropertyDOMMap.get(key)!.textContent =
				`${numeral(val).format("0.00")}`;
		}
	}
}