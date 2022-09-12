import { DependencyMocker } from './dependency-mocker';
import { TestMockMapper } from './test-mock-mapper';

export abstract class TestSuite<TClass> {
    private declarations = new Array<any>();
    private imports = new Array<any>();
    private customProviders = new Array<any>();
    private mockProviders = new Array<any>();
    private mockMapper: TestMockMapper;
    private class: TClass;
    private initializedTest: boolean;
    private initializedTests: boolean;
    private disposedTests: boolean;
    
    private callbacks = new Array<() => void>();

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

    public beforeEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.push(() => {
            beforeEach(async () => {
                if (this.initializedTest) {
                    return callback(this.class, this.mockMapper);
                }

                this.class = await this.initializeTest(this.mockMapper, this.declarations, this.imports, this.providers);
                this.initializedTest = true;

                callback(this.class, this.mockMapper);
            });
        });

        return this;
    }

    public afterEach(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.push(() => {
            afterEach(() => callback(this.class, this.mockMapper));
        });

        return this;
    }

    public beforeAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
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

    public afterAll(callback: (classInstance: TClass, mocks: TestMockMapper) => void) {
        this.callbacks.push(() => {
            afterAll(async () => {
                if (this.disposedTests) {
                    return callback(this.class, this.mockMapper);
                }

                await this.disposeTests(this.mockMapper, this.declarations, this.imports, this.providers);
                this.disposedTests = true;

                callback(this.class, this.mockMapper)
            });
        });

        return this;
    }

    public run() {
        this.beforeAll(() => {});
        this.beforeEach(() => {});
        this.afterAll(() => {});

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
