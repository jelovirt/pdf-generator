declare module 'saxon-js' {
  // export {Options, Result} from './saxon-js'
  export interface Options {
    stylesheetInternal: any;
    destination: string;
    stylesheetParams?: { payload: { [key: string]: string } };
    initialMode?: string;
    sourceType: 'json' | 'xml';
    sourceText: string;
  }
  export interface Result {
    principalResult: string;
  }
  export async function transform(options: Options, type?: 'sync'): Result;
  export async function transform(
    options: Options,
    type: 'async'
  ): Promise<Result>;
  export default class SaxonJS {
    static async transform(options: Options, type?: 'sync'): Result;
    static async transform(options: Options, type: 'async'): Promise<Result>;
  }
}
