import { Logical_Operator, Comparison_Operator } from './Tokenizer';
import * as Syntaxer from './Syntaxer';
export interface Condition {
    type: 'condition';
    attribute: string;
    operator: Comparison_Operator;
    value: string | number;
}
export interface Filter {
    type: 'filter';
    operator: Logical_Operator;
    conditions: Condition[];
}
export declare type Node = Filter | Condition;
export interface Semantic_Tree {
    filter: Filter;
}
export default function Semantiker(syntax_tree: Syntaxer.Syntax_Tree): Semantic_Tree;
