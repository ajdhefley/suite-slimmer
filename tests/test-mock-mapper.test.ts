import { mockService } from './test-mock';
import { TestMockMapper } from './test-mock-mapper';

class FakeService {

}

describe('test-mock-mapper.ts', () => {
    it('TestMockMapper should return mocked service', () => {
        //Arrange
        let mapper = new TestMockMapper();
        mapper.add(FakeService);

        //Act
        let mockedService = mockService(FakeService);
        let mapperMockedService = mapper.get(FakeService);

        //Assert
        expect(mapperMockedService.constructor).toEqual(mockedService.constructor);
    });
});