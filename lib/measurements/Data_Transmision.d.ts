import Data_Storage from './Data_Storage';
import { Measure } from './Measurement';
export default class Data_Transmision extends Data_Storage {
    name: string;
    constructor();
    find(value: string): Measure | undefined;
}
