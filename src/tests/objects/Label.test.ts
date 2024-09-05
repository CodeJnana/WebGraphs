import { Vector3 } from 'three';
import { expect, test } from 'vitest';
import Label from '../../objects/Label';

test('Label is working', () => {
    const label = new Label({ text: 'test', position: new Vector3(0, 0, 0) });
    expect(label).toBeTruthy();
    expect(label.children.length).toBe(1);
    expect(label.children[0].type).toBe('Mesh');
    expect(label.children[0].geometry.type).toBe('TextGeometry');
    expect(label.children[0].geometry.text).toBe('test');
    expect(label.children[0].material.color.getHexString()).toBe('d3d3d3');
    expect(label.children[0].position).toEqual(new Vector3(0, 0, 0));
})
