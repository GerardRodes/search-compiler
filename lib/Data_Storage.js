import './Tokenizer-2913129a.js';
import { Condition_Text_Part_Type } from './Syntaxer.js';
import Measurement from './Measurement.js';
import { p as parse_number } from './Numbers-9e03096b.js';

class Data_Storage extends Measurement {
  constructor() {
    super(...arguments);
    this.name = 'Data_Storage';
    this.measures = [{
      name: 'bit',
      abbreviation: 'b',
      format: q => q
    }, {
      name: 'byte',
      abbreviation: 'B',
      format: q => q * 8
    }, {
      name: 'kilobit',
      abbreviation: 'kb',
      format: q => q * 1000
    }, {
      name: 'megabit',
      abbreviation: 'Mb',
      format: q => q * 1000000
    }, {
      name: 'gigabit',
      abbreviation: 'Gb',
      format: q => q * 1000000000
    }, {
      name: 'terabit',
      abbreviation: 'Tb',
      format: q => q * 1000000000000
    }, {
      name: 'kilobyte',
      abbreviation: 'kB',
      format: q => q * 8 * 1000
    }, {
      name: 'megabyte',
      abbreviation: 'MB',
      format: q => q * 8 * 1000000
    }, {
      name: 'gigabyte',
      abbreviation: 'GB',
      format: q => q * 8 * 1000000000
    }, {
      name: 'terabyte',
      abbreviation: 'TB',
      format: q => q * 8 * 1000000000000
    }, {
      name: 'kibibit',
      abbreviation: 'Kib',
      format: q => q * Math.pow(2, 10)
    }, {
      name: 'mebibit',
      abbreviation: 'Mib',
      format: q => q * Math.pow(2, 20)
    }, {
      name: 'gibibit',
      abbreviation: 'Gib',
      format: q => q * Math.pow(2, 30)
    }, {
      name: 'tebibit',
      abbreviation: 'Tib',
      format: q => q * Math.pow(2, 40)
    }, {
      name: 'kibibyte',
      abbreviation: 'Kib',
      format: q => q * 8 * Math.pow(2, 10)
    }, {
      name: 'mebibyte',
      abbreviation: 'Mib',
      format: q => q * 8 * Math.pow(2, 20)
    }, {
      name: 'gibibyte',
      abbreviation: 'GiB',
      format: q => q * 8 * Math.pow(2, 30)
    }, {
      name: 'tebibyte',
      abbreviation: 'TiB',
      format: q => q * 8 * Math.pow(2, 40)
    }];
  }

  find(value) {
    var _ref, _this$by_abbreviation;

    var lower = value.toLowerCase();
    return (_ref = (_this$by_abbreviation = this.by_abbreviation[value]) !== null && _this$by_abbreviation !== void 0 ? _this$by_abbreviation : this.by_name[lower]) !== null && _ref !== void 0 ? _ref : this.by_name[lower.slice(0, -1)];
  }

  parse(parts) {
    if (parts.length !== 2) return;
    if (parts[0].type === Condition_Text_Part_Type.Remaining || parts[1].type === Condition_Text_Part_Type.Number) return;
    var measure = this.find(parts[1].value);
    if (measure == null) return;
    return measure.format(parse_number(parts[0].value));
  }

}

export default Data_Storage;
