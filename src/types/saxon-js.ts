export interface Options {
  stylesheetInternal: any;
  destination: string;
  stylesheetParams?: { [key: string]: string };
  initialMode?: string;
  sourceType: 'json' | 'xml';
  sourceText: string;
}
export interface Result {
  principalResult: string;
}
// export async function transform(options: Options, type?: 'sync'): Result;
// export async function transform(
//   options: Options,
//   type: 'async'
// ): Promise<Result>;
export interface SaxonJS {
  transform(options: Options, type?: 'sync'): Result;
  transform(options: Options, type: 'async'): Promise<Result>;
}
