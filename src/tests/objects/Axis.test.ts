import { describe, expect, it } from "vitest";
import { AxisLine } from "../../objects/Axis";

describe("Axis", () => {
    it("should create an axis", () => {
        const axis = new AxisLine('x', -10, 10, 2);
        expect(axis).toBeDefined();
    });
    it("step should be empty", () => {
        const axis = new AxisLine('x', -10, 10);
        expect(axis.stepPositions).toEqual([]);
        const axis2 = new AxisLine('y', 0, 0);
        expect(axis2.stepPositions).toEqual([]);
    });
    it("step should not be empty", () => {
        const axis = new AxisLine('x', -10, 10, 2);
        expect(axis.stepPositions.length).toEqual(10);
        expect(axis.stepPositions[0]).toEqual({ x: -10, y: 0, z: 0 });
        expect(axis.stepPositions[5]).toEqual({ x: 2, y: 0, z: 0 });
        expect(axis.stepPositions[8]).toEqual({ x: 8, y: 0, z: 0 });
        expect(axis.stepPositions[9]).toEqual({ x: 10, y: 0, z: 0 });
    });
});