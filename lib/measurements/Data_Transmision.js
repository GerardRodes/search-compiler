import '../Numbers.js';
import { _ as _objectSpread2 } from '../Tokenizer-2913129a.js';
import '../Syntaxer.js';
import './Measurement.js';
import Data_Storage from './Data_Storage.js';

class Data_Transmision extends Data_Storage {
  constructor() {
    super();
    this.name = 'Data_Transmision';
    this.measures = this.measures.map(measure => _objectSpread2({}, measure, {
      name: measure.name + 's',
      abbreviation: measure.abbreviation + '/s'
    }));
  }

  find(value) {
    var _ref, _this$by_abbreviation;

    var normalized = value.replace('ps', '').replace('/s', '') + '/s';
    var lower = value.toLowerCase();
    return (_ref = (_this$by_abbreviation = this.by_abbreviation[normalized]) !== null && _this$by_abbreviation !== void 0 ? _this$by_abbreviation : this.by_name[lower]) !== null && _ref !== void 0 ? _ref : this.by_name[lower.slice(0, -1)];
  }

}

export default Data_Transmision;
