import { DependencyMocker } from './dependency-mocker';

export interface MockType<T> extends Function {
    new(...args: any[]): T;
}

export class TestMockMapper {
    private mocks = {};

    constructor(private mocker: DependencyMocker) {

    }

    public add<TMock>(type: MockType<TMock>) {
        this.mocks[type.name] = this.mocker.mockService(type);
    }

    public addExplicit<TMock>(type: MockType<TMock>, value: any) {
        this.mocks[type.name] = value;
    }

    public get<TMock>(serviceType: MockType<TMock>) {
        return this.mocks[serviceType.name];
    }
}