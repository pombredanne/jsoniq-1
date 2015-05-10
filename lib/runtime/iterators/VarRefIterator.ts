/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class VarRefIterator extends Iterator {

    private dctx: DynamicContext;
    private varName: string;
    private state: Iterator;

    constructor(position: Position, dctx: DynamicContext, varName: string) {
        super(position);
        this.dctx = dctx;
        this.varName = varName;
    }

    next(): Promise<Item> {
        super.next();
        return this.dctx.getVariable("", this.varName).next();
    }

    isClosed(): boolean {
        return this.dctx.getVariable("", this.varName).isClosed();
    }

    reset(): Iterator {
        super.reset();
        this.dctx.getVariable("", this.varName).reset();
        this.state = undefined;
        return this;
    }
};

export = VarRefIterator;
