import { StringWriter } from '../helpers/string.helper';
import { Docs, DocsGenerator } from '../models';
import { UseCaseDiagramGenerator } from './use-case-diagram.generator';

export class DocsHtmlGenerator implements DocsGenerator<Docs> {
  generate(docs: Docs): string {
    const writer = new StringWriter();

    writer.appendBlock('<html>', '</html>', () => {
      writer.appendBlock('<head>', '</head>', () => {
        writer.appendLine(`<title>DocsDD - ${docs.title}</title>`);
      });

      writer.appendBlock('<body>', '</body>', () => {
        writer.appendLine(`<h1>DocsDD - ${docs.title}</h1>`);
        writer.appendLine(`<p>${docs.description}</p>`);

        docs.useCases.forEach((useCase) => {
          writer.appendBlock('<h2>', '</h2>', () => writer.append(useCase.id));
          if (useCase.description) {
            writer.appendLine(`<p>${useCase.description}</p>`);
          }
          writer.appendBlock(
            `<pre id="diagram-${useCase.id}" class="mermaid">`,
            '</pre>',
            () => writer.append(new UseCaseDiagramGenerator().generate(useCase))
          );
        });

        writer.appendLine(
          '<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>'
        );
        writer.appendLine(
          '<script>mermaid.initialize({startOnLoad:true});</script>'
        );
      });
    });

    return writer.getText();
  }
}
