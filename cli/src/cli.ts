/* See: https://www.youtube.com/watch?v=e1KJ47tyCso*/
import * as fs from "fs";
import { DocsHtmlGenerator } from "./generators/docs-html.generator";
import { CypressTestsGenerator } from "./generators/cypress-tests.generator";
import { CliParams, parseCliParams } from "./helpers/cli-params.helper";
import { Docs, UseCaseGenerator } from "./models";
import * as ts from "typescript";

try {
  run();
} catch (e) {
  unhandledException();
}

function run() {
  const command = process.argv[2] as "docs" | "tests" | "help";
  const params = parseCliParams(process.argv.slice(3));

  switch (command) {
    case "docs":
      watch(params, () => generateDocs(params));
      break;
    case "tests":
      watch(params, () => generateTests(params));
      break;
    case "help":
      help();
      break;
    default:
      console.error(`Command '${command}' not recognized.`);
      help();
      break;
  }
}

function watch(
  params: CliParams,
  onChange: (event?: fs.WatchEventType, fileName?: string) => void
) {
  try {
    onChange();
  } catch {
    unhandledException();
  }

  if (params.watch) {
    fs.watch(`${process.cwd()}/${params.input}`, (event, filename) => {
      try {
        onChange(event, filename);
      } catch (e) {
        unhandledException();
      }
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
  const htmlDocs = new DocsHtmlGenerator().generate(docs);
  const outputPath = `${process.cwd()}/${params.output}`;
  fs.writeFileSync(outputPath, htmlDocs);
  console.log(
    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: '${outputPath}' sucessfully generated.`
  );
}

function generateTests(params: CliParams) {
  const docs = getDocs(params);
  let tests: string;
  switch (params.target) {
    case "cypress":
      tests = new CypressTestsGenerator().generate(docs);
      break;
    default:
      console.error(`Target '${params.target}' not supported.`);
      break;
  }
  const outputPath = `${process.cwd()}/${params.output}`;
  fs.writeFileSync(outputPath, tests);
  console.log(
    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: '${outputPath}' sucessfully generated.`
  );
}

function help() {
  // TODO
}

function unhandledException() {
  console.error(
    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Unhandled exception occured.`
  );
}
