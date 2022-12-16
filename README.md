# suite-slimmer &nbsp; ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ajdhefley/suite-slimmer/main.yml?branch=main) &nbsp; [![Node version](https://img.shields.io/npm/v/suite-slimmer.svg?style=flat)](http://nodejs.org/download/)

Streamlines JavaScript testing.

## Packages

This is mostly intended for either [Angular](https://github.com/angular/angular) or [NestJS](https://github.com/nestjs/nest) projects, using the following packages:

* See [suite-slimmer-angular](https://www.npmjs.com/package/suite-slimmer-angular)
* See [suite-slimmer-nest](https://www.npmjs.com/package/suite-slimmer-nest)

## Usage

Tests can also be written for non-Angular and non-NestJS projects with this package directly.

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

## Frameworks

The following test frameworks are supported:

* Jasmine
* Jest
* Mocha

## Examples

See examples [here](https://github.com/ajdhefley/suite-slimmer-angular/tree/main/examples).
