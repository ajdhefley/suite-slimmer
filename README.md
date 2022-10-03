# suite-slimmer

Streamlines JavaScript testing.

While this package is mainly intended for use with [Angular](https://github.com/angular/angular) or [NestJS](https://github.com/nestjs/nest) (see below), standalone test suites can be created. 

## Packages

* See [suite-slimmer-angular](https://www.npmjs.com/package/suite-slimmer-angular)
* See [suite-slimmer-nest](https://www.npmjs.com/package/suite-slimmer-nest)

## Usage

### Creating a test

Instantiate a test suite, providing the class type being tested.

```
import { SlimTestSuite } from 'suite-slimmer'

new SlimTestSuite(MyClass)
  .addProviders(new MyDependencyA(), new MyDependencyB())
  .addTest('should create class', (cls) => {
    expect(cls).to.be.truthy
  })
  .run()
```

On `SlimTestSuite`, the following methods are available and chainable:

* addImports
* addDeclarations
* addProviders
* addMocks
* addTest
* beforeEach
* afterEach
* beforeAll
* afterAll
* run
