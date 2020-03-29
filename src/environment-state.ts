import MobilityComponent from "./components/mobility.component";
import TargetComponent from "./components/target.component";
import { difference, rotate, scale } from "./linear-algebra";
import Entity from "./entities/entity";

export default interface EnvironmentState {
	readonly x: number;
	readonly y: number;
	readonly dx: number;
	readonly dy: number;
}

export function getEnvironmentStateFromEntity(entity: Entity): EnvironmentState {
	const mobility = entity.get(MobilityComponent);
	const targets = entity.get(TargetComponent).targets;
	const v = mobility.position;
	const u = targets.length > 0 ?
		targets[0][0].get(MobilityComponent).position :
		v;
	// Get the position of the nearest target with respect to the position and orientation of the
	// entity
	const [x, y] = [...rotate(difference(u, v), -mobility.angle)];
	// Get the velocity of the environment with respect to the position and orientation of the
	// entity
	const [dx, dy] = [...scale(rotate(mobility.velocity, -mobility.angle), -1)];
	return { x: x, y: y, dx: dx, dy: dy };
}

export function getVectorFromEnvironmentState(state: EnvironmentState): number[] {
	return [state.dx, state.dy, state.x, state.y];
}

export function getStateKeyOrder(): string[] {
	return ["dx", "dy", "x", "y"];
}