declare namespace jasmine {
    interface Spy {

    }

    function createSpy(name?: string, originalFn?: (...args: any[]) => any)
}

declare namespace jest {
    interface Mock {
        mockReturnValue(value: any)
    }

    function fn(): Mock
    function clearAllMocks()
}

declare namespace sinon {
    interface SinonStub {
        returns(value: any)
    }

    function stub(): SinonStub
}