import { Vector3 } from 'three';
import { expect, test } from 'vitest';
import Label from '../../objects/Label';

test('Label is working', () => {
    const label = new Label({ text: 'test', position: new Vector3(2, 5, 10) });
    expect(label).toBeTruthy();
    expect(label.lblGeometry.text).toStrictEqual('test');
    expect(label.lblMesh.position).toStrictEqual(new Vector3(2, 5, 10));
})
