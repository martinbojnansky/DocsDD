/* See: https://www.youtube.com/watch?v=e1KJ47tyCso*/
import * as fs from "fs";
import { UseCaseDiagramGeneratorImpl } from "./generators";
import { UseCaseDiagram } from "./models";

function run() {
  const input = process.argv[2];
  const output = process.argv[3];

  const schema = new UseCaseDiagramGeneratorImpl().generate(
    JSON.parse(
      fs.readFileSync(`${process.cwd()}/${input}`).toString()
    ) as UseCaseDiagram
  );

  fs.writeFileSync(
    `${process.cwd()}/${output}`,
    `<html><body><pre>${schema}</pre></body></html>`
  );
}

run();
