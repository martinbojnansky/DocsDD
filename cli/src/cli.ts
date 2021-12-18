/* See: https://www.youtube.com/watch?v=e1KJ47tyCso*/
import * as fs from "fs";
import { UseCaseDiagramGenerator } from "./generators";
import { Docs } from "./models";

function run() {
  const input = process.argv[2];
  const output = process.argv[3];

  const useCaseDiagram = new UseCaseDiagramGenerator().generate(
    (
      JSON.parse(
        fs.readFileSync(`${process.cwd()}/${input}`).toString()
      ) as Docs
    ).useCases[0]
  );

  fs.writeFileSync(
    `${process.cwd()}/${output}`,
    `<html><body><pre>${useCaseDiagram}</pre></body></html>`
  );
}

run();
