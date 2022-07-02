import { of } from 'rxjs';

export interface MockType<T> extends Function {
    new(...args: any[]): T;
}

export type MockOf<T> = T & {
    [k in keyof T]: jest.Mock;
};

export function mockService<T>(serviceType: new (...args: any[]) => T): MockOf<T> {
    const res: MockOf<T> = {} as any;

    // Each function will be mocked to return an empty
    // observable by default but this can be overriden.
    Object.getOwnPropertyNames(serviceType.prototype)
        .filter((key) => key != 'constructor')
        .forEach((key) => {
            res[key] = jest.fn().mockReturnValue(of());
        });

    return res;
}

export function mockObject<T>(objectType: new (...args: any[]) => T, overrideProperties?: any): T {
    let object = new objectType();

    for (let propertyName in overrideProperties) {
        object[propertyName] = overrideProperties[propertyName];
    }

    return object;
}
