"use strict";
exports.__esModule = true;
exports.Util = void 0;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.lequal = function (a, b) {
        return (a.length == b.length);
    };
    Util.glequal = function (a, b) {
        return (a.length >= b.length);
    };
    Util.llequal = function (a, b) {
        return (a.length <= b.length);
    };
    Util.logStep = function () {
        console.log("\n----------------------------------------------------------------------\n");
    };
    return Util;
}());
exports.Util = Util;
