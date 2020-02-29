import test from 'ava'
import Tokenizer from '../lib/Tokenizer'
import Syntaxer from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'
import Human_Text_Generator from '../lib/generators/Human_Text_Generator'
import Field_Store from '../lib/Field_Store'
import Time from '../lib/measurements/Time'
import Data_Storage from '../lib/measurements/Data_Storage'
import Data_Transmision from '../lib/measurements/Data_Transmision'

const empty_store = new Field_Store([])
const field_store = new Field_Store([
  {
    name: 'Last name',
    attribute: 'apellido'
  },
  {
    name: 'Duration',
    attribute: 'duration',
    measurement: new Time()
  },
  {
    name: 'Size',
    attribute: 'size',
    measurement: new Data_Storage()
  },
  {
    name: 'Speed',
    attribute: 'speed',
    measurement: new Data_Transmision()
  }
])

const C = (i: string, s: Field_Store): string => Human_Text_Generator(Semantiker(Syntaxer(Tokenizer(i)), s))

test('JSON_Filter_Generator generates operators', t => {
  t.deepEqual(C('last name is not bla blo', empty_store), 'last name is not bla blo')
})
