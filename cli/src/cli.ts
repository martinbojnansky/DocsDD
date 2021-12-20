import * as fs from 'fs';
import * as ts from 'typescript';
import { CypressTestsGenerator } from './generators/cypress-tests.generator';
import { DocsHtmlGenerator } from './generators/docs-html.generator';
import { CliParams, parseCliParams } from './helpers/cli-params.helper';
import { Log } from './helpers/log.helper';
import { trySafe } from './helpers/try-safe.helper';
import { Docs } from './models';

trySafe(
  () => run(),
  (e) => unhandledException(e)
);

function run() {
  const command = process.argv[2] as 'docs' | 'tests' | 'help';
  const params = parseCliParams(process.argv.slice(3));

  switch (command) {
    case 'docs':
      watch(params, () => generateDocs(params));
      break;
    case 'tests':
      watch(params, () => generateTests(params));
      break;
    case 'help':
      help();
      break;
    default:
      Log.error(`Command '${command}' not recognized.`);
      help();
      break;
  }
}

function watch(
  params: CliParams,
  onChange: (event?: fs.WatchEventType, fileName?: string) => void
) {
  trySafe(
    () => onChange(),
    (e) => unhandledException(e)
  );

  if (params.watch) {
    fs.watch(`${process.cwd()}/${params.input}`, (event, filename) => {
      trySafe(
        () => onChange(event, filename),
        (e) => unhandledException(e)
      );
    });
  }
}

function getDocs(params: CliParams): Docs {
  const fileContent = fs
    .readFileSync(`${process.cwd()}/${params.input}`)
    .toString();

  if (params.input.endsWith('.ts')) {
    return eval(ts.transpileModule(fileContent, {}).outputText);
  } else if (params.input.endsWith('.js')) {
    return eval(fileContent);
  } else if (params.input.endsWith('.json')) {
    return JSON.parse(fileContent) as Docs;
  }
}

function generateDocs(params: CliParams) {
  const docs = getDocs(params);
  const htmlDocs = new DocsHtmlGenerator().generate(docs);
  const outputPath = `${process.cwd()}/${params.output}`;
  fs.writeFileSync(outputPath, htmlDocs);
  Log.success(`'${outputPath}' sucessfully generated.`);
}

function generateTests(params: CliParams) {
  const docs = getDocs(params);
  let tests: string;
  switch (params.target) {
    case 'cypress':
      tests = new CypressTestsGenerator().generate(docs);
      break;
    default:
      Log.error(`Target '${params.target}' not supported.`);
      break;
  }
  const outputPath = `${process.cwd()}/${params.output}`;
  fs.writeFileSync(outputPath, tests);
  Log.success(`'${outputPath}' generated.`);
}

function help() {
  // TODO
}

function unhandledException<T>(ex: T) {
  Log.error('Unhandled exception occured.');
}
