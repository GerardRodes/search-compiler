import Measurement, { Measure } from './Measurement'
import { Condition_Text_Part, Condition_Text_Part_Type } from '../Syntaxer'
import { parse_number } from '../Numbers'

export default class Data_Storage extends Measurement {
  name = 'Data_Storage'
  measures: Measure[] = [
    {
      name: 'bit',
      abbreviation: 'b',
      format: (q: number) => q
    },
    {
      name: 'byte',
      abbreviation: 'B',
      format: (q: number) => q * 8
    },

    // ================================
    // BASE 10
    // ================================

    {
      name: 'kilobit',
      abbreviation: 'kb',
      format: (q: number) => q * 1_000
    },
    {
      name: 'megabit',
      abbreviation: 'Mb',
      format: (q: number) => q * 1_000_000
    },
    {
      name: 'gigabit',
      abbreviation: 'Gb',
      format: (q: number) => q * 1_000_000_000
    },
    {
      name: 'terabit',
      abbreviation: 'Tb',
      format: (q: number) => q * 1_000_000_000_000
    },

    {
      name: 'kilobyte',
      abbreviation: 'kB',
      format: (q: number) => q * 8 * 1_000
    },
    {
      name: 'megabyte',
      abbreviation: 'MB',
      format: (q: number) => q * 8 * 1_000_000
    },
    {
      name: 'gigabyte',
      abbreviation: 'GB',
      format: (q: number) => q * 8 * 1_000_000_000
    },
    {
      name: 'terabyte',
      abbreviation: 'TB',
      format: (q: number) => q * 8 * 1_000_000_000_000
    },

    // ================================
    // BASE 2
    // ================================

    {
      name: 'kibibit',
      abbreviation: 'Kib',
      format: (q: number) => q * Math.pow(2, 10)
    },
    {
      name: 'mebibit',
      abbreviation: 'Mib',
      format: (q: number) => q * Math.pow(2, 20)
    },
    {
      name: 'gibibit',
      abbreviation: 'Gib',
      format: (q: number) => q * Math.pow(2, 30)
    },
    {
      name: 'tebibit',
      abbreviation: 'Tib',
      format: (q: number) => q * Math.pow(2, 40)
    },

    {
      name: 'kibibyte',
      abbreviation: 'Kib',
      format: (q: number) => q * 8 * Math.pow(2, 10)
    },
    {
      name: 'mebibyte',
      abbreviation: 'Mib',
      format: (q: number) => q * 8 * Math.pow(2, 20)
    },
    {
      name: 'gibibyte',
      abbreviation: 'GiB',
      format: (q: number) => q * 8 * Math.pow(2, 30)
    },
    {
      name: 'tebibyte',
      abbreviation: 'TiB',
      format: (q: number) => q * 8 * Math.pow(2, 40)
    }
  ]

  find (value: string): Measure | undefined {
    const lower = value.toLowerCase()
    return this.by_abbreviation[value] ??
      this.by_name[lower] ??
      this.by_name[lower.slice(0, -1)]
  }

  parse (parts: Condition_Text_Part[]): number {
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
