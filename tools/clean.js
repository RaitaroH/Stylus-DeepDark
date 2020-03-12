#!/usr/bin/env node
"use strict";

// this script does some cleanups after perfectionist ran

const {readFile} = require("fs").promises;
const {join} = require("path");
const {writeFile, exit} = require("./utils");

const source = join(__dirname, "..", "StylusDeepDark.user.css");

const replacements = [
    // Perfectionist adds comments to the end of the previous line...
    // }/* comment */ => }\n\n  /* comment */
    {from: /}\/\*(([\s\S])+?)\*\/\s*/g, to: "}\n\n  /*$1*/\n  "},
    {from: /,\s\/\*/g, to: ",\n  /*"},
    // Remove leading whitespace from @-moz-document entries
    {from: /\n\s{15}/g, to: "\n"},
];

async function main() {
  let css = await readFile(source, "utf8");
  for (const replacement of replacements) {
    css = css.replace(replacement.from, replacement.to);
  }
  await writeFile(source, css);
}

main().then(exit).catch(exit);
