declare type Token_Type = '__initial_value__' | 'word' | 'number' | 'or' | 'and' | 'not' | 'includes' | 'equal' | 'not_equal' | 'greater' | 'greater_or_equal' | 'lower' | 'lower_or_equal';
interface Token {
    type: Token_Type;
    value: string;
}
export default function Tokenizer(input: string): Token[];
export {};
