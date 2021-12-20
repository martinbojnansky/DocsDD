export class StringWriter {
  private text = '';
  private indent = 0;

  increaseIndent(times: number = 1) {
    this.indent += 2 * times;
  }

  decreaseIndent(times: number = 1) {
    this.indent -= 2 * times;
    if (this.indent < 0) this.indent = 0;
  }

  append(text: string) {
    for (let i = 0; i < this.indent; i++) {
      this.text += ' ';
    }
    this.text += text;
  }

  appendLine(text: string = '') {
    this.append(`${text}\n`);
  }

  appendBlock(start: string, end: string, body: () => void) {
    this.appendLine(start);
    this.increaseIndent();
    body();
    this.decreaseIndent();
    this.appendLine(end);
  }

  getText(): string {
    return this.text;
  }
}
