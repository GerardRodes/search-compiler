export declare type Comparison_Operator = 'includes' | 'equal' | 'not_equal' | 'greater' | 'greater_or_equal' | 'lower' | 'lower_or_equal';
export declare type Logical_Operator = 'or' | 'and';
export declare type Operator = Comparison_Operator | Logical_Operator | 'not';
export declare type Token_Type = Operator | '__initial_value__' | 'word' | 'number';
export interface Token {
    type: Token_Type;
    value: string;
}
export default function Tokenizer(input: string): Token[];
