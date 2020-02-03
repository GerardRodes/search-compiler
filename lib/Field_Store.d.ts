import Measurement from './measurements/Measurement';
import { Condition_Text_Part } from './Syntaxer';
export interface Field_Definition {
    name: string;
    attribute: string;
    possible_values?: Array<string | number>;
    measurement?: Measurement;
}
export default class Field_Store {
    fields: Field_Definition[];
    by_attr: {
        [key: string]: Field_Definition;
    };
    by_name: {
        [key: string]: Field_Definition;
    };
    constructor(fields?: Field_Definition[]);
    find(parts: Condition_Text_Part[]): Field_Definition | undefined;
}
