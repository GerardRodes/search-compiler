import { Semantic_Tree } from '../Semantiker';
import { Condition_Operator_Part_Type, Filter_Operator_Type } from '../Syntaxer';
interface JSON_Condition {
    operator: Condition_Operator_Part_Type;
    attr: string;
    value: string | number;
    flags?: {
        negated?: boolean;
    };
}
export interface JSON_Filter {
    logOperator: Filter_Operator_Type;
    conditions: Array<JSON_Condition | JSON_Filter>;
}
export default function JSON_Filter_Generator(semantic_tree: Semantic_Tree): JSON_Filter;
export {};
