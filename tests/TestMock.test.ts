import { of } from 'rxjs';
import { mockService, mockObject } from './test-mock';

class FakeService {
    public property = 'property';
    public publicFunction() { }
    private protectedFunction() { }
    private privateFunction() { }
}

class FakeObject {
    StrProp: string;
    IntProp: number;
    BoolProp: boolean;
}

describe('test-mock.ts', () => {
    it('mockService should create service instance that returns empty observables from all functions (no properties)', () => {
        //Arrange
        //Act
        let mockedService = mockService(FakeService);

        //Assert
        expect((mockedService.publicFunction() as any).constructor).toEqual(of().constructor);
        expect((mockedService as any).protectedFunction().constructor).toEqual(of().constructor);
        expect((mockedService as any).privateFunction().constructor).toEqual(of().constructor);
        expect((mockedService as any).property).toBeUndefined();
    });

    it('mockObject should create class instance with overriden properties', () => {
        //Arrange
        //Act
        let mockedObj = mockObject(FakeObject, { StrProp: 'string', IntProp: 9, BoolProp: true });

        //Assert
        expect(mockedObj.StrProp).toEqual('string');
        expect(mockedObj.IntProp).toEqual(9);
        expect(mockedObj.BoolProp).toEqual(true);
    });
});