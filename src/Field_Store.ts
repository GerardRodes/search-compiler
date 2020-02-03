import Measurement from './measurements/Measurement'
import { Condition_Text_Part } from './Syntaxer'

export interface Field_Definition {
  name: string
  attribute: string
  possible_values?: Array<string|number>
  measurement?: Measurement
}

export default class Field_Store {
  fields: Field_Definition[]
  by_attr: {[key: string]: Field_Definition} = {}
  by_name: {[key: string]: Field_Definition} = {}

  constructor (fields: Field_Definition[] = []) {
    this.fields = fields

    for (const field of fields) {
      this.by_attr[field.attribute.toLowerCase()] = field
      this.by_name[field.name.toLowerCase()] = field

      if (field.measurement != null) {
        field.measurement.init()
      }
    }
  }

  find (parts: Condition_Text_Part[]): Field_Definition | undefined {
    const name = parts.map(condition => condition.value.toLowerCase()).join(' ')
    const value = this.by_name[name]

    return value
  }
}
