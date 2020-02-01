import { Token, Text_Type, Comparison_Operator, Logical_Operator } from './Tokenizer';
export declare type Filter_Operator_Type = Logical_Operator;
export declare const Filter_Operator_Type: {
    Or: Logical_Operator.Or;
    And: Logical_Operator.And;
};
export declare type Condition_Operator_Part_Type = Comparison_Operator | Logical_Operator;
export declare const Condition_Operator_Part_Type: {
    Or: Logical_Operator.Or;
    And: Logical_Operator.And;
    Includes: Comparison_Operator.Includes;
    Not_includes: Comparison_Operator.Not_includes;
    Equal: Comparison_Operator.Equal;
    Not_equal: Comparison_Operator.Not_equal;
    Greater: Comparison_Operator.Greater;
    Greater_or_equal: Comparison_Operator.Greater_or_equal;
    Lower: Comparison_Operator.Lower;
    Lower_or_equal: Comparison_Operator.Lower_or_equal;
    Not: Comparison_Operator.Not;
};
export declare type Condition_Text_Part_Type = Text_Type;
export declare const Condition_Text_Part_Type: {
    Remaining: Text_Type.Remaining;
    Number: Text_Type.Number;
};
export declare enum Condition_Type {
    Filter = "filter",
    Condition = "condition"
}
export declare type Node_Type = Filter_Operator_Type | Condition_Type | Condition_Text_Part_Type | Condition_Operator_Part_Type;
export declare const Node_Type: {
    Or: Logical_Operator.Or;
    And: Logical_Operator.And;
    Includes: Comparison_Operator.Includes;
    Not_includes: Comparison_Operator.Not_includes;
    Equal: Comparison_Operator.Equal;
    Not_equal: Comparison_Operator.Not_equal;
    Greater: Comparison_Operator.Greater;
    Greater_or_equal: Comparison_Operator.Greater_or_equal;
    Lower: Comparison_Operator.Lower;
    Lower_or_equal: Comparison_Operator.Lower_or_equal;
    Not: Comparison_Operator.Not;
    Remaining: Text_Type.Remaining;
    Number: Text_Type.Number;
    Filter: Condition_Type.Filter;
    Condition: Condition_Type.Condition;
};
export interface Value_Node {
    value: string;
    type: Node_Type;
}
export interface Condition_Text_Part extends Value_Node {
    type: Condition_Text_Part_Type;
}
export interface Condition_Operator_Part extends Value_Node {
    type: Condition_Operator_Part_Type;
}
export interface Condition {
    type: Condition_Type.Condition;
    attribute: Condition_Text_Part[];
    operator: Condition_Operator_Part[];
    value: Condition_Text_Part[];
}
export interface Filter_Operator extends Value_Node {
    type: Filter_Operator_Type;
    values: string[];
}
declare type FilterConditions = Array<Condition | Filter>;
export interface Filter {
    type: Condition_Type.Filter;
    operator: Filter_Operator_Type;
    conditions: FilterConditions;
}
export declare type Syntax_Node = Condition_Text_Part | Condition_Operator_Part | Condition | Filter_Operator | Filter;
export interface Syntax_Tree {
    filter: Filter;
}
export default function Syntaxer(tokens: Token[]): Syntax_Tree;
export {};
