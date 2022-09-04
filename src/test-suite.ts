import { TestMockMapper } from './test-mock-mapper';

export abstract class TestSuite<TClass> {
    private declarations = new Array<any>();
    private imports = new Array<any>();
    private customProviders = new Array<any>();
    private mockProviders = new Array<any>();
    private mockMapper = new TestMockMapper();
    private class: TClass;
    private initializedTest: boolean;
    private initializedTests: boolean;
    
    private callbacks = new Array<() => void>();

    private get providers() {
        return this.customProviders.concat(this.mockProviders);
    }

    protected abstract initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): TClass;
    protected abstract initializeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void>;

    constructor(protected name: string, protected excludeOthers: boolean) { }

    addDeclarations(...declarations: any[]): TestSuite<TClass> {
        this.declarations.push(...declarations);
        return this;
    }

    addImports(...imports: any[]): TestSuite<TClass> {
        this.imports.push(...imports);
        return this;
    }

    addProviders(...providers: any[]): TestSuite<TClass> {
        this.customProviders.push(...providers);
        return this;
    }

    addMocks(...services: any[]): TestSuite<TClass> {
        this.callbacks.push(() => {
            beforeEach(() => {
                this.mockProviders = [];
                services.forEach((service) => {
                    this.mockMapper.add(service);
                    this.mockProviders.push({ provide: service, useValue: this.mockMapper.get(service) });
                });
            });
        });

        return this;
    }

    addTest(description: string, callback: (classInstance: TClass, mocks: TestMockMapper) => void, excludeOthers?: boolean): TestSuite<TClass> {
        this.callbacks.push(() => {
            if (excludeOthers) {
                fit(description, () => callback(this.class, this.mockMapper));
            }
            else {
                it(description, () => callback(this.class, this.mockMapper));
            }
        });

        return this;
    }

    beforeEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void): TestSuite<TClass> {
        this.callbacks.push(() => {
            beforeEach(() => {
                if (this.initializedTest) {
                    return callback(this.class, this.mockMapper);
                }

                this.class = this.initializeTest(this.mockMapper, this.declarations, this.imports, this.providers);
                this.initializedTest = true;

                callback(this.class, this.mockMapper);
            });
        });

        return this;
    }

    afterEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void): TestSuite<TClass> {

        return this;
    }

    beforeAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void): TestSuite<TClass> {
        this.callbacks.push(() => {
            beforeAll(async () => {
                if (this.initializedTests) {
                    return callback(this.class, this.mockMapper);
                }

                await this.initializeTests(this.mockMapper, this.declarations, this.imports, this.providers);
                this.initializedTests = true;

                callback(this.class, this.mockMapper);
            });
        });

        return this;
    }

    afterAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void): TestSuite<TClass> {
        this.callbacks.push(() => {
            afterAll(() => callback(this.class, this.mockMapper));
        });

        return this;
    }

    run() {
        this.beforeAll(() => {});
        this.beforeEach(() => {});

        if (this.excludeOthers) {
            fdescribe(this.name, () => {
                this.callbacks.forEach((callback) => callback());
            });
        }
        else {
            describe(this.name, () => {
                this.callbacks.forEach((callback) => callback());
            });
        }
    }
}
