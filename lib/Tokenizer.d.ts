export declare enum Comparison_Operator {
    Includes = "includes",
    Not_includes = "not_includes",
    Equal = "equal",
    Not_equal = "not_equal",
    Greater = "greater",
    Greater_or_equal = "greater_or_equal",
    Lower = "lower",
    Lower_or_equal = "lower_or_equal",
    Not = "not"
}
export declare enum Logical_Operator {
    Or = "or",
    And = "and"
}
export declare enum Text_Type {
    Remaining = "remaining",
    Number = "number"
}
export declare type Token_Type = Text_Type | Logical_Operator | Comparison_Operator;
export declare const Token_Type: {
    Remaining: Text_Type.Remaining;
    Number: Text_Type.Number;
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
export interface Token {
    type: Token_Type;
    value: string;
}
export default function Tokenizer(input: string): Token[];
