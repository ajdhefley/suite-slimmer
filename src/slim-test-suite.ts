import { TestMockMapper } from './test-mock-mapper';
import { TestSuite } from './test-suite';

export class SlimTestSuite<T> extends TestSuite<T> {
    constructor(private target: (new(...args: any[]) => T) | string, excludeOthers?: boolean) {
        super(null, typeof target === 'string' ? target : target.name, excludeOthers);
    }

    protected initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<T> {
        if (typeof this.target === 'string') {
            return Promise.resolve({} as T)
        }
        else {
            return Promise.resolve(new this.target(...providers) as T);
        }
    }

    protected initializeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void> {
        return Promise.resolve()
    }

    protected disposeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void> {
        return Promise.resolve()
    }
}