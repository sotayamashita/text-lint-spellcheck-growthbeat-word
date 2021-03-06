"use strict";
var RuleHelper = require("textlint-rule-helper").RuleHelper;
var spellCheck = require("./spellcheck-word").spellCheckText;
var dictionaryItems = require("growthbeat-word-rules");
/**
 * @param {RuleContext} context
 *
 * Token from https://github.com/azu/textlint-rule-spellcheck-tech-word
 */
function reporter(context) {
    var helper = new RuleHelper(context);
    var exports = {};
    var fixer = context.fixer;
    var Syntax = context.Syntax;
    exports[context.Syntax.Str] = function (node) {
        if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
            return;
        }
        var text = context.getSource(node);
        var results = spellCheck(text, dictionaryItems);
        results.forEach(function (/*SpellCheckResult*/result) {
            // line, column
            var fixCommand = fixer.replaceTextRange([
                result.paddingIndex, result.paddingIndex + result.actual.length
            ], result.expected);
            context.report(node, new context.RuleError(result.actual + " => " + result.expected, {
                index: result.paddingIndex,
                fix: fixCommand
            }));
        });
    };
    return exports;
}
module.exports = {
    linter: reporter,
    fixer: reporter
};
