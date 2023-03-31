import { MockMapper } from './MockMapper';
import { TestSuite } from './TestSuite';

export class SlimTestSuite<T> extends TestSuite<T> {
    constructor(private target: (new(...args: any[]) => T) | string, excludeOthers?: boolean) {
        super(typeof target === 'string' ? target : target.name, excludeOthers);
    }

    protected initializeTests(mockMapper: MockMapper, declarations: any[], imports: any[]): Promise<void> {
        return Promise.resolve()
    }

    protected initializeTest(mockMapper: MockMapper, declarations: any[], imports: any[], providers: any[]): Promise<T> {
        if (typeof this.target === 'string') {
            return Promise.resolve(undefined)
        }
        else {
            return Promise.resolve(new this.target(...providers) as T);
        }
    }

    protected disposeTests(mockMapper: MockMapper, declarations: any[], imports: any[], providers: any[]): Promise<void> {
        return Promise.resolve()
    }
}