/* See: https://www.youtube.com/watch?v=e1KJ47tyCso*/
import * as fs from "fs";
import { HtmlDocsGenerator } from "./generators/docs/docs.generator";
import { CypressUseCaseTestsGenerator } from "./generators/use-case/cypress-use-case-tests.generator";
import { CliParams, parseCliParams } from "./helpers/cli-params.helper";
import { Docs } from "./models";
import * as ts from "typescript";

run();

function run() {
  const command = process.argv[2] as "docs" | "tests";
  const params = parseCliParams(process.argv.slice(3));

  switch (command) {
    case "docs":
      params.watch
        ? watch(params, () => generateDocs(params))
        : generateDocs(params);
      break;
    case "tests":
      params.watch
        ? watch(params, () => generateTests(params))
        : generateTests(params);
    default:
      break;
  }
}

function watch(
  params: CliParams,
  onChange: (event?: fs.WatchEventType, fileName?: string) => void
) {
  if (params.watch) {
    fs.watch(`${process.cwd()}/${params.input}`, (event, filename) => {
      onChange(event, filename);
    });
  }
}

function getDocs(params: CliParams): Docs {
  const fileContent = fs
    .readFileSync(`${process.cwd()}/${params.input}`)
    .toString();

  if (params.input.endsWith(".ts")) {
    return eval(ts.transpileModule(fileContent, {}).outputText);
  } else if (params.input.endsWith(".js")) {
    return eval(fileContent);
  } else if (params.input.endsWith(".json")) {
    return JSON.parse(fileContent) as Docs;
  }
}

function generateDocs(params: CliParams) {
  const docs = getDocs(params);
  const htmlDocs = new HtmlDocsGenerator().generate(docs);
  fs.writeFileSync(`${process.cwd()}/${params.output}`, htmlDocs);
}

function generateTests(params: CliParams) {
  const docs = getDocs(params);
  let tests: string;
  switch (params.target) {
    case "cypress":
      tests = new CypressUseCaseTestsGenerator().generate(docs.useCases[0]);
      break;
    default:
      break;
  }
  fs.writeFileSync(`${process.cwd()}/${params.output}`, tests);
}
