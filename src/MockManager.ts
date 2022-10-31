import { execSync } from 'child_process';
import { DependencyMocker } from './DependencyMocker';
import { JasmineMocker } from './JasmineMocker';
import { JestMocker } from './JestMocker';
import { MochaMocker } from './MochaMocker';

export abstract class MockManager {
    private static DependencyMocker: DependencyMocker;

    public static setDependencyMocker(dependencyMocker: DependencyMocker) {
        MockManager.DependencyMocker = dependencyMocker;
    }

    public static getDependencyMocker(): DependencyMocker {
        if (!MockManager.DependencyMocker) {
            try {
                if (MockManager.checkDependencyExists('jasmine')) {
                    MockManager.setDependencyMocker(new JasmineMocker());
                }
                else if (MockManager.checkDependencyExists('jest')) {
                    MockManager.setDependencyMocker(new JestMocker());
                }
                else if (MockManager.checkDependencyExists('mocha')) {
                    MockManager.setDependencyMocker(new MochaMocker());
                }
                else {
                    MockManager.setDependencyMocker(new JasmineMocker());
                }
            }
            catch (err) {
                console.error('suite-slimmer: An unexpected error occurred.');
                console.error(err);
                process.exit(1);
            }
        }

        return MockManager.DependencyMocker;
    }

    private static checkDependencyExists(name: string) {
        if (!execSync) return false;
        const bs = execSync('npm ls --json --depth=0');
        const json = JSON.parse(bs.toString()).dependencies;
        const exists = Object.keys(json).includes(name);
        return exists;
    }

    private constructor() {}
}