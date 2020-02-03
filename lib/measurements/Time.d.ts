import Measurement, { Measure } from './Measurement';
import { Condition_Text_Part } from '../Syntaxer';
export default class Time extends Measurement {
    name: string;
    measures: Measure[];
    find(value: string): Measure | undefined;
    parse(parts: Condition_Text_Part[]): number;
}
