import Field_Store from './Field_Store';
import { Condition_Operator_Part_Type, Filter_Operator_Type, Syntax_Tree } from './Syntaxer';
export interface Condition_Operator {
    type: Condition_Operator_Part_Type;
    negated: boolean;
}
export interface Condition_Value {
    type: string;
    value: string | number;
    parts: string[];
}
export interface Condition_Attribute {
    value: string;
    parts: string[];
}
export interface Condition {
    type: 'condition';
    attribute: Condition_Attribute;
    value: Condition_Value;
    operator: Condition_Operator;
}
export interface Filter {
    type: 'filter';
    operator: Filter_Operator_Type;
    conditions: Array<Condition | Filter>;
}
export declare type Node = Filter | Condition;
export interface Semantic_Tree {
    filter: Filter;
}
export default function Semantiker(syntax_tree: Syntax_Tree, field_store?: Field_Store): Semantic_Tree;
