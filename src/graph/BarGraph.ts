import { Group, Scene } from "three";
import { colors } from "../defaults";
import Axis from "../objects/Axis";
import Bar from "../objects/Bar";

export type BarGraphOptions = {
    labels?: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}
export default class BarGraph extends Group {
    private highestYAxisValue: number = 0;
    private lowestYAxisValue: number = 0;

    constructor(
        private options: BarGraphOptions,
        private scene: Scene
    ) {
        super();
        this.calculateYAxisValues();
        this.drawAxis();
        this.drawBars();
    }

    calculateYAxisValues() {
        this.highestYAxisValue = Math.max(...this.options.datasets.map(dataset => Math.max(...dataset.data)));
        this.lowestYAxisValue = Math.min(...this.options.datasets.map(dataset => Math.min(...dataset.data)));

        // if highest value is not in 10s, round it to the nearest 10
        if (this.highestYAxisValue % 10 !== 0) {
            this.highestYAxisValue = Math.ceil(this.highestYAxisValue / 10) * 10;
        }

        // if lowest value is not in 10s, round it to the nearest 10
        if (this.lowestYAxisValue % 10 !== 0) {
            this.lowestYAxisValue = Math.floor(this.lowestYAxisValue / 10) *
                10;
        }

        // if both the highest and lowest values are negative, then the lowest value should be the highest value
        if (this.highestYAxisValue < 0 && this.lowestYAxisValue < 0) {
            this.highestYAxisValue = 0;
        }

        // if both the highest and lowest values are positive, then the highest value should be the lowest value
        if (this.highestYAxisValue > 0 && this.lowestYAxisValue > 0) {
            this.lowestYAxisValue = 0;
        }

        if (this.lowestYAxisValue < 0) {
            if (this.highestYAxisValue > -1 * (this.lowestYAxisValue)) {
                this.lowestYAxisValue = -1 * this.highestYAxisValue;
            }
        }

        if (this.highestYAxisValue > 0) {
            if (-1 * this.lowestYAxisValue > this.highestYAxisValue) {
                this.highestYAxisValue = -1 * this.lowestYAxisValue;
            }
        }
    }

    drawAxis() {
        const axis = new Axis({
            x: {
                from: 0,
                to: this.options.labels?.length ?? 0,
                step: 1,
                label: this.options.labels?.map(label => ({ name: label, color: colors.axis })) ?? [],
                labelCenter: true
            },
            y: {
                from: this.lowestYAxisValue / 10,
                to: this.highestYAxisValue / 10,
                step: 1,
                label: 'numeric'
            },
        }, true);
        this.scene.add(axis);
    }

    drawBars() {
        const barWidth = 1 / this.options.datasets.length;
        for (let i = 0; i < this.options.datasets.length; i++) {
            const dataset = this.options.datasets[i];
            for (let j = 0; j < dataset.data.length; j++) {
                const barHeight = dataset.data[j] / 10;
                const bar = new Bar({
                    width: barWidth - barWidth * 0.2,
                    height: barHeight,
                    depth: 0
                }, {
                    x: j + barWidth / 2,
                    y: 0,
                    z: 0
                }, dataset.backgroundColor[j], true, dataset.borderColor[j], dataset.borderWidth);
                this.scene.add(bar);
            }
        }
    }
}