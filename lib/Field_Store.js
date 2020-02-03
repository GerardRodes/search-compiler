class Field_Store {
  constructor() {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this.by_attr = {};
    this.by_name = {};
    this.fields = fields;

    for (var field of fields) {
      this.by_attr[field.attribute.toLowerCase()] = field;
      this.by_name[field.name.toLowerCase()] = field;

      if (field.measurement != null) {
        field.measurement.init();
      }
    }
  }

  find(parts) {
    var name = parts.map(condition => condition.value.toLowerCase()).join(' ');
    var value = this.by_name[name];
    return value;
  }

}

export default Field_Store;
