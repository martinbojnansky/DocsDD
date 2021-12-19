import { StringWriter } from "../../helpers/string.helper";
import {
  UseCase,
  UseCaseMessageStep,
  UseCaseGenerator,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from "../../models";

export class UseCaseDiagramGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    writer.appendLine("sequenceDiagram");
    writer.increaseIndent();

    useCase.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.id}`);
    });

    writer.appendLine();

    useCase.steps.forEach((step) => {
      switch (step.type) {
        case "message":
        case "request":
        case "response":
          const reqresStep = step as
            | UseCaseMessageStep
            | UseCaseRequestStep
            | UseCaseResponseStep;
          writer.appendLine(
            `${reqresStep.from.id}${reqresStep.arrow}${
              step.type === "request"
                ? "+"
                : step.type === "response"
                ? "-"
                : ""
            }${reqresStep.to.id}: ${reqresStep.id}`
          );
          break;
        default:
          break;
      }
      // TODO: Generate note
    });

    return writer.getText();
  }
}
