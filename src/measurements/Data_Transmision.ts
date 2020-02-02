import Data_Storage from './Data_Storage'
import { Measure } from './Measurement'

export default class Data_Transmision extends Data_Storage {
  constructor () {
    super()

    this.measures = this.measures.map(measure => ({
      ...measure,
      name: measure.name + 's',
      abbreviation: measure.abbreviation + '/s'
    }))
  }

  find (value: string): Measure | undefined {
    const normalized = value
      .replace('ps', '')
      .replace('/s', '') + '/s'

    const lower = value.toLowerCase()
    return this.by_abbreviation[normalized] ??
      this.by_name[lower] ??
      this.by_name[lower.slice(0, -1)]
  }
}
