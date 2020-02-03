import Measurement, { Measure } from './Measurement'
import { Condition_Text_Part, Condition_Text_Part_Type } from '../Syntaxer'
import { parse_number } from '../Numbers'

export default class Time extends Measurement {
  name = 'Time'
  measures: Measure[] = [
    {
      name: 'millisecond',
      abbreviation: 'ms',
      format: (q: number): number => q / 1000
    },
    {
      name: 'second',
      abbreviation: 's',
      format: (q: number): number => q
    },
    {
      name: 'minute',
      abbreviation: 'm',
      format: (q: number): number => q * 60
    },
    {
      name: 'hour',
      abbreviation: 'h',
      format: (q: number): number => q * 60 * 60
    },
    {
      name: 'day',
      format: (q: number): number => q * 60 * 60 * 24
    },
    {
      name: 'week',
      format: (q: number): number => q * 60 * 60 * 24 * 7
    },
    {
      name: 'month',
      format: (q: number): number => q * 60 * 60 * 24 * 7 * 30
    },
    {
      name: 'year',
      format: (q: number): number => q * 365 * 24 * 60 * 60
    }
  ]

  find (value: string): Measure | undefined {
    const normal = value.toLowerCase()
    return this.by_abbreviation[normal] ??
      this.by_name[normal] ??
      this.by_name[normal.slice(0, -1)]
  }

  parse (parts: Condition_Text_Part[]): number {
    if (parts.length === 1) {
      // todo: keywords
      return 0
    }

    // 1 hour ago
    if (parts.length !== 2) return

    // expects number + remaining
    if (
      parts[0].type === Condition_Text_Part_Type.Remaining ||
      parts[1].type === Condition_Text_Part_Type.Number
    ) return

    const measure = this.find(parts[1].value)
    if (measure == null) return

    return measure.format(parse_number(parts[0].value))
  }
}
