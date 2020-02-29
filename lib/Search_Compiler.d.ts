import { Semantic_Tree } from './Semantiker';
import Field_Store, { Field_Definition } from './Field_Store';
export default function Search_Compiler(input: string, generator: (sematic_tree: Semantic_Tree, field_store: Field_Store) => any, fields?: Field_Definition[]): any;
