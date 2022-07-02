import { TestMockMapper } from './test-mock-mapper';

export abstract class TestSuiteStrategy {
    abstract initialize(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[], callback: Function);
}

export abstract class TestSuite<TClass> {
    private declarations = new Array<any>();
    private imports = new Array<any>();
    private customProviders = new Array<any>();
    private mockProviders = new Array<any>();
    private mockMapper = new TestMockMapper();
    private class: TClass;
    
    private callbacks = new Array<() => void>();
    private initialized: boolean;

    protected abstract initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[], callback: Function);

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
        if (!this.initialized) {
            this.initialized = true;

            this.callbacks.push(() => {
                // Hijack the created class instance to inject into future callbacks.
                let callbackWrapper = (classInstance: TClass, mocks: TestMockMapper) => {
                    this.class = classInstance;
                    if (callback)
                        callback(classInstance, mocks);
                };

                beforeEach(async () => await this.initializeTest(this.mockMapper, this.declarations, this.imports, this.customProviders.concat(this.mockProviders), callbackWrapper));
            });
        }

        return this;
    }

    afterEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void): TestSuite<TClass> {
        this.callbacks.push(() => {
            afterEach(() => callback(this.class, this.mockMapper));
        });

        return this;
    }

    run() {
        // Call here in case not called externally, to ensure test bed is initialized.
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
