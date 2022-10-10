import { DependencyMocker } from './dependency-mocker';
import { TestMockMapper } from './test-mock-mapper';
import { TestSuiteCallbackCollection } from './test-suite-callback-collection';

export abstract class TestSuite<TClass> {
    private declarations = new Array<any>();
    private imports = new Array<any>();
    private customProviders = new Array<any>();
    private mockProviders = new Array<any>();
    private mockMapper: TestMockMapper;
    private class: TClass;
    private initializedTests: boolean;
    private disposedTests: boolean;
    
    private callbacks = new TestSuiteCallbackCollection();

    private get providers() {
        return this.customProviders.concat(this.mockProviders);
    }

    protected abstract initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<TClass>;
    protected abstract initializeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void>;
    protected abstract disposeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void>;

    constructor(dependencyMocker: DependencyMocker, protected name: string, protected excludeOthers: boolean) {
        this.mockMapper = new TestMockMapper(dependencyMocker);
    }

    public addDeclarations(...declarations: any[]) {
        this.declarations.push(...declarations);
        return this;
    }

    public addImports(...imports: any[]) {
        this.imports.push(...imports);
        return this;
    }

    public addProviders(...providers: any[]) {
        this.customProviders.push(...providers);
        return this;
    }

    public addMocks(...services: any[]) {
        services.forEach((service) => {
            this.mockMapper.add(service);
            this.mockProviders.push({ provide: service, useValue: this.mockMapper.get(service) });
        });
        return this;
    }

    public addTest(description: string, callback: (classInstance: TClass, mocks: TestMockMapper) => void, excludeOthers?: boolean) {
        this.callbacks.tests.push(() => {
            if (excludeOthers) {
                fit(description, () => callback(this.class, this.mockMapper));
            }
            else {
                it(description, () => callback(this.class, this.mockMapper));
            }
        });

        return this;
    }

    public beforeEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.testInitialization = () => {
            beforeEach(async () => {
                this.mockMapper.reset(); // Reset spy calls, etc. before each test

                this.class = await this.initializeTest(this.mockMapper, this.declarations, this.imports, this.providers);

                callback(this.class, this.mockMapper);
            });
        };

        return this;
    }

    public afterEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.testDisposal = () => {
            afterEach(() => callback(this.class, this.mockMapper));
        };

        return this;
    }

    public beforeAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.suiteInitialization = () => {
            const beforeFunction = typeof beforeAll !== 'undefined' ? beforeAll : before;
            
            beforeFunction(async () => {
                if (this.initializedTests) {
                    return callback(this.class, this.mockMapper);
                }

                await this.initializeTests(this.mockMapper, this.declarations, this.imports, this.providers);
                this.initializedTests = true;

                callback(this.class, this.mockMapper);
            });
        };

        return this;
    }

    public afterAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.suiteDisposal = () => {
            const afterFunction = typeof beforeAll !== 'undefined' ? afterAll : after;

            afterFunction(async () => {
                if (this.disposedTests) {
                    return callback(this.class, this.mockMapper);
                }

                await this.disposeTests(this.mockMapper, this.declarations, this.imports, this.providers);
                this.disposedTests = true;

                callback(this.class, this.mockMapper)
            });
        };

        return this;
    }

    public run() {
        if (!this.callbacks.suiteInitialization)
            this.beforeAll(() => {});
            
        if (!this.callbacks.testInitialization)
            this.beforeEach(() => {});

        if (!this.callbacks.suiteDisposal)
            this.afterAll(() => {});

        if (this.excludeOthers) {
            const describeOnlyFunction = typeof fdescribe !== 'undefined' ? fdescribe : describe.only;

            describeOnlyFunction(this.name, () => {
                this.executeCallbacks();
            });
        }
        else {
            describe(this.name, () => {
                this.executeCallbacks();
            });
        }
    }

    private executeCallbacks() {
        this.callbacks.suiteInitialization();
        this.callbacks.tests.forEach((testCallback) => {
            this.callbacks.testInitialization();
            testCallback();
            if (this.callbacks.testDisposal)
                this.callbacks.testDisposal();
        });
        if (this.callbacks.suiteDisposal)
            this.callbacks.suiteDisposal();
    }
}
