export {}

declare global {
    interface Describe {
        (name: string, fn: () => void): void;
        only: Describe;
        skip: Describe;
    }

    var before: (...args: any[]) => any;
    var beforeEach: (...args: any[]) => any;
    var beforeAll: (...args: any[]) => any;
    var after: (...args: any[]) => any;
    var afterEach: (...args: any[]) => any;
    var afterAll: (...args: any[]) => any;
    var it: (name: string, fn: () => void) => any;
    var fit: (name: string, fn: () => void) => any;
    var describe: Describe;
    var fdescribe: Describe;
}