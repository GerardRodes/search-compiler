import { Logical_Operator, Comparison_Operator } from './Tokenizer';
import { SyntaxTree } from './Syntaxer';
export declare type Condition_Operator = Comparison_Operator;
export interface Condition {
    type: 'condition';
    attribute: string;
    operator: Condition_Operator;
    value: string | number;
}
export declare type Filter_Operator = Logical_Operator;
export interface Filter {
    type: 'filter';
    operator: Filter_Operator;
    conditions: Condition[];
}
export declare type Node = Filter | Condition;
export interface SemanticTree {
    filter: Filter;
}
export default function Semantiker(syntaxTree: SyntaxTree): SemanticTree;
