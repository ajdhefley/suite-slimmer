import { MockType } from './MockMapper';

export abstract class DependencyMocker {
    public abstract mockService<T>(serviceType: new (...args: any[]) => T);
    public abstract mockObject<T>(objectType: new (...args: any[]) => T, overrideProperties?: any);
    public abstract reset<T>(mock: MockType<T>);
}