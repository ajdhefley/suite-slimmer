import { MockType, MockOf } from './test-mock';
import { mockService } from './test-mock';

export class TestMockMapper {
    private mocks = {};

    add<TMock>(type: MockType<TMock>) {
        this.mocks[type.name] = mockService(type);
    }

    get<TMock>(serviceType: MockType<TMock>): MockOf<TMock> {
        return this.mocks[serviceType.name];
    }
}