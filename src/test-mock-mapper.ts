import { MockType, MockOf, mockService } from './test-mock';

export class TestMockMapper {
    private mocks = {};

    add<TMock>(type: MockType<TMock>) {
        this.mocks[type.name] = mockService(type);
    }

    addExplicit<TMock>(type: MockType<TMock>, value: any) {
        this.mocks[type.name] = value;
    }

    get<TMock>(serviceType: MockType<TMock>): MockOf<TMock> {
        return this.mocks[serviceType.name];
    }
}