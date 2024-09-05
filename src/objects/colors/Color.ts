import { Color } from "three";
import { colors } from "../../defaults";
import Settings from "../../settings";

type ColorObject = {
    [K in keyof typeof colors]: number | string | Color;
};

const handler = {
    get(target: any, property: string): Color {
        if (property in target) {
            return target[property][Settings.MODE];
        } else {
            // if mode black return white else return black
            return target[property][Settings.MODE === 'light' ? '0x000000' : '0xffffff'];
        }
    }
};

export const Colors = new Proxy(colors, handler) as ColorObject;