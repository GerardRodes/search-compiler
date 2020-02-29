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
  t.deepEqual(C('last name is not bla blo', empty_store), 'last name is not equal to bla blo')

  t.deepEqual(C('a is equal b', empty_store), 'a is equal to b')

  t.deepEqual(C('a != b', empty_store), 'a is not equal to b')

  t.deepEqual(C('a is not equal b', empty_store), 'a is not equal to b')

  t.deepEqual(C('a is in b', empty_store), 'b includes a')

  t.deepEqual(C('a is not in b', empty_store), 'b does not include a')

  t.deepEqual(C('a is above b', empty_store), 'a is greater than b')

  t.deepEqual(C('a is above or equal b', empty_store), 'a is greater or equal to b')

  t.deepEqual(C('a is above or b', empty_store), 'a is greater or equal to b')

  t.deepEqual(C('a <= b', empty_store), 'a is lower or equal to b')

  t.deepEqual(C('a not <= b', empty_store), 'a is not lower or equal to b')

  t.deepEqual(C('a not <= b and c is a or a not above a', empty_store), 'a is not lower or equal to b and c is equal to a or a is not greater than a')
})
