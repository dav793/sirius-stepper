# SiriusStepper

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.9.

## Installation

1. Clone and enter
    ```bash
    $/> git clone ...
    $/> cd sirius-stepper
    $/sirius-stepper>
    ```

2. Build
    
    **Production:**
    ```bash
    $/sirius-stepper> ng build sirius-stepper
    ```
    **Development:**
    ```bash
    $/sirius-stepper> ng build sirius-stepper --watch
    ```

3. Link build with NPM locally
    ```bash
    $/sirius-stepper> cd dist/sirius-stepper
    $/sirius-stepper/dist/sirius-stepper> npm link
    ```

4. Finally, link in your application
    ```bash
    $/> cd ${APP_ROOT}
    $/APP_ROOT> npm link sirius-stepper 
    ```
    
## Usage
 
### Import module in your application

```javascript
import { SiriusStepperModule } from 'sirius-stepper';

@NgModule({
  ...
  imports: [ SiriusStepperModule ],
  ...
})
```




# Added by Angular

## Code scaffolding

Run `ng generate component component-name --project sirius-stepper` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project sirius-stepper`.
> Note: Don't forget to add `--project sirius-stepper` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build sirius-stepper` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build sirius-stepper`, go to the dist folder `cd dist/sirius-stepper` and run `npm publish`.

## Running unit tests

Run `ng test sirius-stepper` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
