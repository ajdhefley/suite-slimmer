import { DependencyMocker } from './DependencyMocker';
import { MockType } from './MockMapper';

export type JasmineMockOf<T> = T & {
    [k in keyof T]: jasmine.Spy;
}

export class JasmineMocker extends DependencyMocker {
    public override mockService<T>(serviceType: new (...args: any[]) => T): JasmineMockOf<T> {
        const res = {} as any;
    
        // Each function will be mocked to return an empty
        // observable by default but this can be overriden.
        Object.getOwnPropertyNames(serviceType.prototype)
            .filter((key) => key != 'constructor')
            .forEach((key) => {
                res[key] = jasmine.createSpy(key).and.returnValue({} as any)
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
        Object.values(mock).forEach((spy) => spy.calls.reset());
    }
}