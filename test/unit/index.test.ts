import * as assert from 'assert'
import * as sinon from 'sinon'
import * as Index from '../../src/index'
import * as Typescript from '../../src/typescript'
import { Database } from '../../src/schema'
import Options, { OptionValues } from '../../src/options'

const options: OptionValues = {}

describe('index', () => {
    const typedTableSandbox = sinon.createSandbox()
    const db = {
        getDefaultSchema: typedTableSandbox.stub(),
        getTableTypes: typedTableSandbox.stub(),
        query: typedTableSandbox.stub(),
        getEnumTypes: typedTableSandbox.stub(),
        getTableDefinition: typedTableSandbox.stub(),
        getSchemaTables: typedTableSandbox.stub(),
        connectionString: 'sql://'
    } as Database
    const tsReflection = Typescript as any
    const dbReflection = db as any
    before(() => {
        typedTableSandbox.stub(Typescript, 'generateEnumType')
        typedTableSandbox.stub(Typescript, 'generateTableTypes')
        typedTableSandbox.stub(Typescript, 'generateTableInterface')
    })
    beforeEach(() => {
        typedTableSandbox.reset()
    })
    after(() => {
        typedTableSandbox.restore()
    })
    describe('typescriptOfTable', () => {
        it('calls functions with correct params', async () => {
            dbReflection.getTableTypes.returns(Promise.resolve('tableTypes'))
            await Index.typescriptOfTable(db, 'tableName', 'schemaName', new Options(options))
            assert.deepStrictEqual(dbReflection.getTableTypes.getCall(0).args, [
                'tableName',
                'schemaName',
                new Options(options)
            ])
            assert.deepStrictEqual(tsReflection.generateTableTypes.getCall(0).args, [
                'tableName',
                'tableTypes',
                new Options(options)
            ])
            assert.deepStrictEqual(tsReflection.generateTableInterface.getCall(0).args, [
                'tableName',
                'tableTypes',
                new Options(options)
            ])
        })
        it('merges string results', async () => {
            dbReflection.getTableTypes.returns(Promise.resolve('tableTypes'))
            tsReflection.generateTableTypes.returns('generatedTableTypes\n')
            tsReflection.generateTableInterface.returns('generatedTableInterfaces\n')
            const typescriptString = await Index.typescriptOfTable(db, 'tableName', 'schemaName', new Options(options))
            assert.strictEqual(typescriptString, 'generatedTableTypes\ngeneratedTableInterfaces\n')
        })
    })
    describe('typescriptOfSchema', () => {
        it('has schema', async () => {
            dbReflection.getSchemaTables.returns(Promise.resolve(['tablename']))
            dbReflection.getEnumTypes.returns(Promise.resolve('enumTypes'))
            tsReflection.generateTableTypes.returns('generatedTableTypes\n')
            tsReflection.generateEnumType.returns('generatedEnumTypes\n')
            const tsOfSchema = await Index.typescriptOfSchema(db, [], 'schemaName', options)

            assert.deepStrictEqual(dbReflection.getSchemaTables.getCall(0).args[0], 'schemaName')
            assert.deepStrictEqual(dbReflection.getEnumTypes.getCall(0).args[0], 'schemaName')
            assert.deepStrictEqual(tsReflection.generateEnumType.getCall(0).args[0], 'enumTypes')
            assert.deepStrictEqual(tsReflection.generateTableTypes.getCall(0).args[0], 'tablename')
        })
        it('has tables provided', async () => {
            dbReflection.getSchemaTables.returns(Promise.resolve(['tablename']))
            dbReflection.getEnumTypes.returns(Promise.resolve('enumTypes'))
            tsReflection.generateTableTypes.returns('generatedTableTypes\n')
            tsReflection.generateEnumType.returns('generatedEnumTypes\n')
            const tsOfSchema = await Index.typescriptOfSchema(db, ['differentTablename'], null, options)

            assert(!dbReflection.getSchemaTables.called)
            assert.deepStrictEqual(tsReflection.generateEnumType.getCall(0).args[0], 'enumTypes')
            assert.deepStrictEqual(tsReflection.generateTableTypes.getCall(0).args[0], 'differentTablename')
        })
    })
})
