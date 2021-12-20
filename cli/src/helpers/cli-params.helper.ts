import { Log } from './log.helper';

export type CliParams = {
  [key in 'watch' | 'input' | 'output' | 'target']?: string;
};

export const parseCliParam = (arg: string): CliParams => {
  if (!arg.startsWith('--')) {
    Log.error(`Parameter '${arg}' not recognized.`);
  } else if (arg.includes('=')) {
    const parts = arg.split('=');
    return { [parts[0].substring(2)]: parts[1] };
  } else {
    return { [arg.substring(2)]: 'true' };
  }
};

export const parseCliParams = (
  args: string[]
): { [key in 'watch' | 'input' | 'output']?: string } => {
  let params: { [key: string]: string } = {};
  args.forEach((arg) => {
    params = {
      ...params,
      ...parseCliParam(arg),
    };
  });
  return params;
};
