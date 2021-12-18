/* See: https://www.youtube.com/watch?v=e1KJ47tyCso*/
import * as fs from "fs";
import { HtmlDocsGenerator } from "./generators/docs/docs.generator";
import { CliParams, parseCliParams } from "./helpers/cli-params.helper";
import { Docs } from "./models";

run();

function run() {
  const command = process.argv[2] as "docs" | "tests";
  const params = parseCliParams(process.argv.slice(3));

  switch (command) {
    case "docs":
      params.watch ? watchAndGenerateDocs(params) : generateDocs(params);
      break;
    default:
    /* TODO Unknown command error. */
  }
}

function watchAndGenerateDocs(params: CliParams) {
  if (params.watch) {
    fs.watch(`${process.cwd()}/${params.input}`, (event, filename) => {
      try {
        generateDocs(params);
      } catch {
        // TODO: Log error.
      }
    });
  }
}

function generateDocs(params: CliParams) {
  const docs = JSON.parse(
    fs.readFileSync(`${process.cwd()}/${params.input}`).toString()
  ) as Docs;
  const htmlDocs = new HtmlDocsGenerator().generate(docs);

  fs.writeFileSync(`${process.cwd()}/${params.output}`, htmlDocs);

  // TODO: Log success
}
