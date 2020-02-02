import { Condition_Text_Part } from '../Syntaxer';
export interface Measure {
    name: string;
    abbreviation?: string;
    format: (q: number) => number;
}
export default class Measurement {
    by_name: {
        [key: string]: Measure;
    };
    by_abbreviation: {
        [key: string]: Measure;
    };
    measures: Measure[];
    init(): void;
    find(value: string): Measure | undefined;
    parse(parts: Condition_Text_Part[]): undefined | number | string;
}
