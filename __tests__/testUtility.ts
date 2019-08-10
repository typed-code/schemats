import * as fs from 'mz/fs';
import * as path from 'path';
import * as ts from 'typescript';
import { Database, typescriptOfSchema } from '../src';

const diff = require('diff');

interface IDiffResult {
  value: string;
  count?: number;
  added?: boolean;
  removed?: boolean;
}

export function compile(fileNames: string[], options: ts.CompilerOptions): boolean {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();
  const exitCode = emitResult.emitSkipped ? 1 : 0;
  return exitCode === 0;
}

export async function compare(goldStandardFile: string, outputFile: string): Promise<boolean> {
  const gold = await fs.readFile(path.resolve(goldStandardFile), { encoding: 'utf8' });
  const actual = await fs.readFile(path.resolve(outputFile), { encoding: 'utf8' });

  const diffs = diff.diffLines(gold, actual, { ignoreWhitespace: true, newlineIsToken: true });

  const addOrRemovedLines = diffs.filter((d: IDiffResult) => d.added || d.removed);

  if (addOrRemovedLines.length > 0) {
    console.error(`Generated type definition different to the standard ${goldStandardFile}`);
    addOrRemovedLines.forEach((d: IDiffResult, i: number) => {
      const t = d.added ? '+' : d.removed ? '-' : 'x';
      console.error(`  [${i}] ${t} ${d.value}`);
    });
    return false;
  } else {
    return true;
  }
}

export async function loadSchema(db: Database, file: string) {
  const query = await fs.readFile(path.resolve(file), {
    encoding: 'utf8',
  });
  return db.query(query);
}

export async function writeTsFile(
  inputSQLFile: string,
  inputConfigFile: string,
  outputFile: string,
  db: Database
) {
  await loadSchema(db, inputSQLFile);
  const config: any = require(path.resolve(inputConfigFile));
  const formattedOutput = await typescriptOfSchema(db, config.tables, config.schema, {
    camelCase: config.camelCase,
    writeHeader: config.writeHeader,
  });
  await fs.writeFile(path.resolve(outputFile), formattedOutput);
}
