import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import Graph, { AxisLine } from "../../objects/Axis";

describe("Axis", () => {
    it("should create an axis", () => {
        const axis = new AxisLine('x', { from: -10, to: 10 });
        expect(axis).toBeDefined();
    });
    it("step should be empty", () => {
        const axis = new AxisLine('x', { from: -10, to: 10 });
        expect(axis.stepPositions).toEqual([]);
        const axis2 = new AxisLine('y', { from: -10, to: 10 });
        expect(axis2.stepPositions).toEqual([]);
    });
    it("step should not be empty", () => {
        const axis = new AxisLine('x', { from: -10, to: 10, step: 2 });
        expect(axis.stepPositions.length).toEqual(10);
        expect(axis.stepPositions[0]).toEqual({ x: -10, y: 0, z: 0 });
        expect(axis.stepPositions[5]).toEqual({ x: 2, y: 0, z: 0 });
        expect(axis.stepPositions[8]).toEqual({ x: 8, y: 0, z: 0 });
        expect(axis.stepPositions[9]).toEqual({ x: 10, y: 0, z: 0 });
    });
    it("should calculate correct parallel axis points", () => {
        const axis = new AxisLine('x', { from: -10, to: 10, step: 2 });
        const point = new Vector3(5, 0, 0);
        const parallelPointsY = axis.getParallelAxisPoints(point, { name: 'y', point: { from: -10, to: 10 } });
        expect(parallelPointsY.from).toEqual({ x: 5, y: -10, z: 0 });
        expect(parallelPointsY.to).toEqual({ x: 5, y: 10, z: 0 });
        const parallelPointsZ = axis.getParallelAxisPoints(point, { name: 'z', point: { from: -10, to: 10 } });
        expect(parallelPointsZ.from).toEqual({ x: 5, y: 0, z: -10 });
        expect(parallelPointsZ.to).toEqual({ x: 5, y: 0, z: 10 });
    });
    it("should calculate correct intersection points", () => {
        const graph = new Graph({
            axes: {
                x: { from: -10, to: 10, step: 2 },
                y: { from: -10, to: 10, step: 2 },
                z: { from: -10, to: 10, step: 2 }
            }
        });
        const intersections = graph.getIntersectionPoint('x', 'y');
        expect(intersections[0]).toEqual({ x: -10, y: -10, z: 0 });
        expect(intersections[1]).toEqual({ x: -10, y: -8, z: 0 });
        expect(intersections[intersections.length - 1]).toEqual({ x: 10, y: 10, z: 0 });
    });
    it('should get intersction line points', () => {
        const graph = new Graph({
            axes: {
                x: { from: -10, to: 10, step: 2 },
                y: { from: -10, to: 10, step: 2 },
                z: { from: -10, to: 10, step: 2 }
            }
        });
        const intersectionPoint = graph.calculateIntersectionLinePoints(
            new Vector3(10, 10, 0),
            { name: 'z', point: { from: -10, to: 10 } }
        );
        expect(intersectionPoint).toEqual({
            from: { x: 10, y: 10, z: -10 },
            to: { x: 10, y: 10, z: 10 }
        });
    });
});