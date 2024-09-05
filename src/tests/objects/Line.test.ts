import { Vector3 } from 'three';
import { expect, test } from 'vitest';
import Line from '../../objects/Line';

test('Line is working', () => {
    const from = new Vector3(2, 5, 10);
    const to = new Vector3(2, 5, 10);
    const line = new Line({
        from,
        to
    });

    expect(line).toBeTruthy();
    expect(line.lineGeometry.getAttribute('position').count).toStrictEqual(2);
})
