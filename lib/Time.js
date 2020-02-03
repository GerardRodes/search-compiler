import './Tokenizer-2913129a.js';
import { Condition_Text_Part_Type } from './Syntaxer.js';
import Measurement from './Measurement.js';
import { p as parse_number } from './Numbers-9e03096b.js';

class Time extends Measurement {
  constructor() {
    super(...arguments);
    this.name = 'Time';
    this.measures = [{
      name: 'millisecond',
      abbreviation: 'ms',
      format: q => q / 1000
    }, {
      name: 'second',
      abbreviation: 's',
      format: q => q
    }, {
      name: 'minute',
      abbreviation: 'm',
      format: q => q * 60
    }, {
      name: 'hour',
      abbreviation: 'h',
      format: q => q * 60 * 60
    }, {
      name: 'day',
      format: q => q * 60 * 60 * 24
    }, {
      name: 'week',
      format: q => q * 60 * 60 * 24 * 7
    }, {
      name: 'month',
      format: q => q * 60 * 60 * 24 * 7 * 30
    }, {
      name: 'year',
      format: q => q * 365 * 24 * 60 * 60
    }];
  }

  find(value) {
    var _ref, _this$by_abbreviation;

    var normal = value.toLowerCase();
    return (_ref = (_this$by_abbreviation = this.by_abbreviation[normal]) !== null && _this$by_abbreviation !== void 0 ? _this$by_abbreviation : this.by_name[normal]) !== null && _ref !== void 0 ? _ref : this.by_name[normal.slice(0, -1)];
  }

  parse(parts) {
    if (parts.length === 1) {
      return 0;
    }

    if (parts.length !== 2) return;
    if (parts[0].type === Condition_Text_Part_Type.Remaining || parts[1].type === Condition_Text_Part_Type.Number) return;
    var measure = this.find(parts[1].value);
    if (measure == null) return;
    return measure.format(parse_number(parts[0].value));
  }

}

export default Time;
