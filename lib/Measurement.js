class Measurement {
  constructor() {
    this.by_name = {};
    this.by_abbreviation = {};
    this.measures = [];
  }

  init() {
    if (this.measures.length === 0) {
      throw new Error('Measures no initialized');
    }

    for (var measure of this.measures) {
      this.by_name[measure.name] = measure;
      if (measure.abbreviation == null) continue;
      this.by_abbreviation[measure.abbreviation] = measure;
    }
  }

  find(value) {
    throw new Error('Override');
  }

  parse(parts) {
    throw new Error('Override');
  }

}

export default Measurement;
