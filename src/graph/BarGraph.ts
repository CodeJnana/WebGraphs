import { Scene } from "three";

export type BarGraphOptions = {
    label?: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}
export default class BarGraph {
    private highestYAxisValue: number = 0;
    private lowestYAxisValue: number = 0;

    constructor(
        private options: BarGraphOptions,
        private scene: Scene
    ) {
        this.calculateYAxisValues();
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

        console.log(this.highestYAxisValue, this.lowestYAxisValue);
    }
}