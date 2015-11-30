/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class ForIterator extends IteratorClause {

    private static index = 0;

    private varName: string;
    private allowEmpty: boolean;
    private positionalVar: string;
    private expr: Iterator;

    constructor(
        position: Position, varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator
    ) {
        super(position);
        this.varName = varName;
        this.allowEmpty = allowEmpty;
        this.positionalVar = positionalVar;
        this.expr = expr;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        ForIterator.index++;
        var index = ForIterator.index;
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node.add("let $$pos" + index + " = 0;\n");
        if(this.positionalVar) {
            node.add("let $" + this.positionalVar + " = $$pos" + index + ";\n");
        }
        node.add("for(let $" + this.varName + " of ");
        node.add(this.expr.serialize());
        node.add(") {\n");
        node.add("$$pos" + index + "++;\n");
        if(this.positionalVar) {
            node.add("$" + this.positionalVar + " = $$pos" + index + ";\n");
        }
        node.add(
            clauses[0].serializeClause(clauses.slice(1))
        );
        node.add("}\n");
        return node;
    }
}
