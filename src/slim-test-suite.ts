import { TestMockMapper } from './test-mock-mapper';
import { TestSuite } from './test-suite';

export class SlimTestSuite<T> extends TestSuite<T> {
    constructor(private target: new(...args: any[]) => T, excludeOthers?: boolean) {
        super(null, target.name, excludeOthers);
    }

    protected initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<T> {
        return Promise.resolve(new this.target(...providers));
    }

    protected initializeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void> {
        return Promise.resolve()
    }

    protected disposeTests(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void> {
        return Promise.resolve()
    }
}