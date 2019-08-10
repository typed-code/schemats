import * as fs from 'mz/fs';
import * as path from 'path';
import * as ts from 'typescript';
import { Database, typescriptOfSchema } from '../src';

export function compile(fileNames: string[], options: ts.CompilerOptions): boolean {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();
  const exitCode = emitResult.emitSkipped ? 1 : 0;

  return exitCode === 0;
}

export async function loadSchema(db: Database, file: string) {
  const query = await fs.readFile(path.resolve(file), {
    encoding: 'utf8',
  });
  return db.query(query);
}

export async function generateTypes(
  inputSQLFile: string,
  config: { tables: string[]; schema?: string; camelCase?: boolean; writeHeader?: boolean },
  db: Database
) {
  await loadSchema(db, inputSQLFile);

  return typescriptOfSchema(db, config.tables, config.schema, {
    camelCase: !!config.camelCase,
    writeHeader: !!config.writeHeader,
  });
}

export async function writeTypesOf(
  inputSQLFile: string,
  config: { tables: string[]; schema?: string; camelCase?: boolean; writeHeader?: boolean },
  db: Database
) {
  const output = await generateTypes(inputSQLFile, config, db);
  const outputFile = inputSQLFile.replace('fixture', 'actual').replace('.sql', '.ts');
  await fs.writeFile(path.resolve(outputFile), output);
}

export function condDescribe(cond: boolean, context: any, ...args: any[]) {
  if (cond) {
    describe.apply(context, args);
  } else {
    describe.skip.apply(context, args);
  }
}

export function condBeforeAll(cond: boolean, context: any, ...args: any[]) {
  if (cond) {
    beforeAll.apply(context, args);
  }
}
