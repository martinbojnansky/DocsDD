import * as fs from 'fs';

export class StringWriter {
  private text: string;
  private indent: number;

  constructor() {
    this.reset();
  }

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

  appendFile(path: fs.PathOrFileDescriptor) {
    this.append(fs.readFileSync(path).toString());
  }

  reset() {
    this.text = '';
    this.indent = 0;
  }

  getText(): string {
    return this.text;
  }
}
