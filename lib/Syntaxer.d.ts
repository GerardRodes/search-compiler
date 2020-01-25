import { Token, Comparison_Operator, Logical_Operator } from './Tokenizer';
interface Condition {
    attribute: string;
    comparison_operator: Comparison_Operator;
}
interface Filter {
    logical_operator: Logical_Operator;
    body: Array<Condition | Filter>;
}
export default function Syntaxer(tokens: Token[]): Filter;
export {};
