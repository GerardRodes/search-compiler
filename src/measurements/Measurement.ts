import { Condition_Text_Part } from '../Syntaxer'

export interface Measure {
  name: string
  abbreviation?: string
  format: (q: number) => number
}

export default class Measurement {
  by_name: {[key: string]: Measure} = {}
  by_abbreviation: {[key: string]: Measure} = {}
  measures: Measure[] = []
  name: string

  init (): void {
    if (this.measures.length === 0) {
      throw new Error('Measures no initialized')
    }

    if (this.name == null) {
      throw new Error('Name no initialized')
    }

    for (const measure of this.measures) {
      this.by_name[measure.name] = measure
      if (measure.abbreviation == null) continue
      this.by_abbreviation[measure.abbreviation] = measure
    }
  }

  find (value: string): Measure | undefined {
    throw new Error('Override')
  }

  parse (parts: Condition_Text_Part[]): undefined | number | string {
    throw new Error('Override')
  }
}
