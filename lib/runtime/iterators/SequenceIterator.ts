/// <reference path="../../typings/tsd.d.ts" />
import es6Promise = require("es6-promise");

import Iterator = require("./Iterator");

class SequenceIterator implements Iterator {

    private closed: boolean = false;
    private its: any[];

    constructor(its: Iterator[]) {
        this.its = its;
        if(this.its.length === 0) {
            this.closed = true;
        }
    }

    next(): Promise<any> {
        if(this.closed) {
            throw new Error("Iterator is closed.");
        }
        var result = this.its[0].next();
        this.its.splice(0, 1);
        if(this.its.length === 0) {
            this.closed = true;
        }
        return result;
    }

    closed(): boolean {
        return this.closed;
    }
};

export = SequenceIterator;