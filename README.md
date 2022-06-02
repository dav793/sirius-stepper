# SiriusStepper

An Angular library for a Stepper UI component.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.

## Installation

1. Clone and enter
    ```bash
    $/> git clone https://github.com/dav793/sirius-stepper.git
    $/> cd sirius-stepper
    $/sirius-stepper>
    ```
    
2. Install dependencies
    ```bash
    $/sirius-stepper> npm install
    ``` 

3. Build lib
    
    **Production:**
    ```bash
    $/sirius-stepper> ng build sirius-stepper
    ```
    **Development:**
    ```bash
    $/sirius-stepper> ng build sirius-stepper --watch
    ```

4. Link lib build with NPM locally
    ```bash
    $/sirius-stepper> cd dist/sirius-stepper
    $/sirius-stepper/dist/sirius-stepper> npm link
    ```

5. Finally, link back in your application
    ```bash
    $/> cd ${APP_ROOT}
    $/APP_ROOT> npm link sirius-stepper 
    ```
    
6. (Optional) In order for `ng serve` to work properly, open your application's `angular.json` 
    and add the following key-value pair under `projects.{YOUR APP}.architect.build.options`:
    ```json
    "preserveSymlinks": true
    ```
    This step should not be necessary if you only build your application in production.
    
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

### Example App

See the [example app](https://github.com/dav793/sirius-stepper-test) for a working example.

### Docs

#### lib-sirius-stepper
This component wraps around your logo and steps, and provides the stepper functionality.

As an example:
```html
<lib-sirius-stepper
  highlight-color="#ff9949"
  muted-color="#aaaaaa"
  font-family="Helvetica"
  font-size="12px"
  [override-step]="overrideStepIndex$"
  (steps)="stepsChanged($event)"
  (step-changes)="stepIndexChanged($event)"
  #stepper
>

    <!-- add your logo here -->
    <!-- add your steps here -->
    
</lib-sirius-stepper>
```

##### Properties
* `highlight-color` _(optional)_

  _Type: `string`_ \
  _Range : any valid CSS `color`._
  
  Set the color of highlighted graphics and text.
  <br/><br/>
  
* `muted-color` _(optional)_

  _Type: `string`_ \
  _Range : any valid CSS `color`._
  
  Set the color of muted graphics and text.
  <br/><br/>
  
* `font-family` _(optional)_

  _Type: `string`_ \
  _Range : any valid CSS `font-family`._
  
  Set the font used in text.  
  <br/><br/>
  
* `font-size` _(optional)_

  _Type: `string`_ \
  _Range : any valid value for the CSS property `font-size`._
  
  Set the size of text.  
  <br/><br/>
  
* `[override-step]` _(optional)_

  _Type: `Observable<number>`_
  
  Use this Input to manually override the current step viewed. 
  
  If you provide an Observable, whenever it emits a number, it will set the current step index to it.
  <br/><br/>   
  
* `(steps)` _(optional)_

  _Type: `EventEmitter<number[]>`_
  
  On this Output, the stepper component will emit an array containing the indexes of all steps, whenever they are changed in the template.
  <br/><br/> 

* `(step-changes)` _(optional)_

  _Type: `EventEmitter<number>`_
  
  On this Output, the stepper component will emit the current step's index, whenever it changes.
  <br/><br/>
  
* `#stepper`

  Required template reference to link the steps with the stepper component.
  <br/><br/>
  
#### sirius-logo
Add an `ng-template` tag with this directive inside the stepper component to set your company logo.

As an example:
```html
<lib-sirius-stepper
    ...
    #stepper
>
  
  <ng-template sirius-logo>
  
    <!-- Add your logo HTML here -->
    <img src="/assets/logo.png" alt="image">
    
  </ng-template>

</lib-sirius-stepper>
```

#### sirius-step
Add an `ng-template` tag with this directive inside the stepper component to insert each step.

As an example:
```html
<lib-sirius-stepper
    ...
    #stepper
>
  
  <!-- Add your steps here -->
  <ng-template sirius-step 
    [link]="stepper" 
    [step]="1" 
    label="YOUR STEP TITLE"
  >
    
    <!-- Put any HTML you want inside the step -->
    <h2>Step 1</h2>
    <label for="name">Name</label>&nbsp;
    <input id="name" type="text" [(ngModel)]="model.name"/>

  </ng-template>

</lib-sirius-stepper>
```

##### Properties
* `[link]`

  _Type: `SiriusStepperComponent`_
  
  Required to link the step with the stepper component.
  <br/><br/>

* `[step]`

  _Type: `number`_
  
  Set a unique index for the step. The steps will be ordered in ascending order by their step index. 
  <br/><br/>

* `label` _(optional)_

  _Type: `string`_
  
  Set the text to label this step in the step controls.
  <br/><br/>
