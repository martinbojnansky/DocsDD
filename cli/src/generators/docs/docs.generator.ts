import { StringWriter } from "../../helpers/string.helper";
import { Docs, DocsGenerator } from "../../models";
import { UseCaseDiagramGenerator } from "../use-case/use-case-diagram.generator";

export class HtmlDocsGenerator implements DocsGenerator<Docs> {
  generate(docs: Docs): string {
    const writer = new StringWriter();

    writer.appendBlock("<html>", "</html>", () => {
      writer.appendBlock("<head>", "</head>", () => {
        writer.appendLine(`<title>DocsDD - ${docs.title}</title>`);
      });

      writer.appendBlock("<body>", "</body>", () => {
        docs.useCases.forEach((useCase) => {
          writer.appendBlock("<h2>", "</h2>", () => writer.append(useCase.id));
          writer.appendBlock(
            `<pre id="diagram-${useCase.id}" class="mermaid">`,
            "</pre>",
            () => writer.append(new UseCaseDiagramGenerator().generate(useCase))
          );
        });

        writer.appendLine(
          '<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>'
        );
        writer.appendLine(
          "<script>mermaid.initialize({startOnLoad:true});</script>"
        );
      });
    });

    return writer.getText();
  }
}
