import { TestMockMapper } from './TestMockMapper';
import { TestSuite } from './TestSuite';

export class SlimTestSuite<T> extends TestSuite<T> {
    constructor(private target: (new(...args: any[]) => T) | string, excludeOthers?: boolean) {
        super(typeof target === 'string' ? target : target.name, excludeOthers);
    }

    protected initializeTest(mockMapper: TestMockMapper, declarations: any[], imports: any[], providers: any[]): Promise<T> {
        if (typeof this.target === 'string') {
            return Promise.resolve(undefined)
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