export class TestSuiteCallbackCollection {
    suiteInitialization: () => void;
    suiteDisposal: () => void;
    testInitialization: () => void;
    testDisposal: () => void;
    tests = new Array<() => void>();
}