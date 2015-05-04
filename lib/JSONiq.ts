/// <reference path="../typings/tsd.d.ts" />
import Marker = require("./compiler/Marker");
import Translator = require("./compiler/Translator");
import Position = require("./compiler/parsers/Position");
//import ASTNode = require("./compiler/parsers/ASTNode");
import JSONiqParser = require("./compiler/parsers/JSONiqParser");
import XQueryParser = require("./compiler/parsers/XQueryParser");
import JSONParseTreeHandler = require("./compiler/parsers/JSONParseTreeHandler");

class JSONiq {

    private source: string;
    private fileName: string = "";
    private markers: Marker[] = [];

    constructor(source: string) {
        this.source = source;
    }

    setFileName(fileName: string): JSONiq {
        this.fileName = fileName;
        return this;
    }

    compile(): JSONiq {
        var isJSONiq = (
            (this.fileName.substring(this.fileName.length - ".jq".length).indexOf(".jq") !== -1) &&
            this.source.indexOf("xquery version") !== 0
        ) || this.source.indexOf("jsoniq version") === 0;
        var h = new JSONParseTreeHandler(this.source);
        var parser = isJSONiq ? new JSONiqParser.Parser(this.source, h) : new XQueryParser.Parser(this.source, h);
        try {
            parser.parse_XQuery();
        } catch (e) {
            if (e instanceof JSONiqParser.ParseException) {
                h.closeParseTree();
                var message: string;
                if(parser instanceof JSONiqParser.Parser) {
                    message = (<JSONiqParser.Parser>parser).getErrorMessage(e);
                } else if(parser instanceof XQueryParser.Parser) {
                    message = (<XQueryParser.Parser>parser).getErrorMessage(e);
                }
                var pos = Position.convertPosition(this.source, e.getBegin(), e.getEnd());
                if (pos.getStartColumn() === pos.getEndColumn() && pos.getStartLine() === pos.getEndLine()) {
                    pos.setEndColumn(pos.getEndColumn() + 1);
                }
                this.markers.push(new Marker(pos, "error", "error", message));
            } else {
                throw e;
            }
        }
        var ast = h.getParseTree();
        var translator = new Translator();
        translator.visit(ast);
        console.log(ast.toXML());
        this.markers = this.markers.concat(translator.getMarkers());
        return this;
    }
}

var jsoniq = new JSONiq("((1 to 10), 11, 11 + 1)");
jsoniq.compile();