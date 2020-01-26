import { Token, Text_Type, Comparison_Operator, Logical_Operator } from './Tokenizer';
export declare type Filter_Operator_Type = Logical_Operator;
export declare const Filter_Operator_Type: {
    Or: Logical_Operator.Or;
    And: Logical_Operator.And;
};
export declare type Condition_Operator_Part_Type = Comparison_Operator;
export declare const Condition_Operator_Part_Type: {
    Includes: Comparison_Operator.Includes;
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
    Word: Text_Type.Word;
    Number: Text_Type.Number;
};
export declare enum Condition_Type {
    Filter = "filter",
    Condition = "condition"
}
export declare type Node_Type = Filter_Operator_Type | Condition_Type | Condition_Text_Part_Type | Condition_Operator_Part_Type;
export declare const Node_Type: {
    Includes: Comparison_Operator.Includes;
    Equal: Comparison_Operator.Equal;
    Not_equal: Comparison_Operator.Not_equal;
    Greater: Comparison_Operator.Greater;
    Greater_or_equal: Comparison_Operator.Greater_or_equal;
    Lower: Comparison_Operator.Lower;
    Lower_or_equal: Comparison_Operator.Lower_or_equal;
    Not: Comparison_Operator.Not;
    Word: Text_Type.Word;
    Number: Text_Type.Number;
    Filter: Condition_Type.Filter;
    Condition: Condition_Type.Condition;
    Or: Logical_Operator.Or;
    And: Logical_Operator.And;
};
interface Node {
    type: Node_Type;
}
interface Value_Node extends Node {
    value: string;
}
interface Condition_Text_Part extends Value_Node {
    type: Condition_Text_Part_Type;
}
interface Condition_Operator_Part extends Value_Node {
    type: Condition_Operator_Part_Type;
}
interface Condition extends Node {
    type: Condition_Type.Condition;
    attribute: Condition_Text_Part[];
    operator: Condition_Operator_Part[];
    value: Condition_Text_Part[];
}
interface Filter extends Node {
    type: Condition_Type.Filter;
    operator: Filter_Operator_Type;
    conditions: Array<Condition | Filter>;
}
export default function Syntaxer(tokens: Token[]): Filter;
export {};
