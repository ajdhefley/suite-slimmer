import { DependencyMocker } from './DependencyMocker';
import { MockType } from './TestMockMapper';

export type MochaMockOf<T> = T & {
    [k in keyof T]: sinon.SinonStub
}

export class MochaMocker extends DependencyMocker {
    public override mockService<T>(serviceType: new (...args: any[]) => T): MochaMockOf<T> {
        const res = {} as any;
    
        // Each function will be mocked to return an empty
        // observable by default but this can be overriden.
        Object.getOwnPropertyNames(serviceType.prototype)
            .filter((key) => key != 'constructor')
            .forEach((key) => {
                res[key] = sinon.stub().returns({} as any);
            });
    
        return res;
    }
    
    public override mockObject<T>(objectType: new (...args: any[]) => T, overrideProperties?: any): T {
        let object = new objectType() as any;
    
        for (let propertyName in overrideProperties) {
            object[propertyName] = overrideProperties[propertyName];
        }
    
        return object;
    }

    public override reset<T>(mock: MockType<T>) {
        Object.values(mock).forEach((stub) => stub.restore());
    }
}