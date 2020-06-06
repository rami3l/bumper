const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')

const format = function (str, col) {
    col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

    return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
        if (m == "{{") {
            return "{";
        }
        if (m == "}}") {
            return "}";
        }
        return col[n];
    });
};

try {
    // `who-to-greet` input defined in action metadata file
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    // Get the replaced text based on the template and the rules given.
    const template = fs.readFileSync(core.getInput("template"), 'utf8');
    const rules_str = fs.readFileSync(core.getInput("rules"), 'utf8');
    const rules = JSON.parse(rules_str);
    const replaced = format(template, rules);
    // console.log(`Replaced text: ${replaced}`);
    core.setOutput("replaced", replaced);

    fs.writeFileSync(core.getInput("out"), replaced, 'utf8');

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}