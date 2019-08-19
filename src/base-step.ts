import { StepDefinition, FieldDefinition, Step as PbStep, RunStepResponse } from './proto/cog_pb';
import { Page } from 'puppeteer';

export interface StepInterface {
  getId(): string;
  getDefinition(): StepDefinition;
  executeStep(step: PbStep): Promise<RunStepResponse>;
}

export interface Field {
  field: string;
  type: FieldDefinition.Type;
  description: string;
}

export abstract class BaseStep {

  protected stepName: string;
  protected stepExpression: string;
  protected stepType: StepDefinition.Type;
  protected expectedFields: Field[];

  constructor(protected page: Page) {}

  getId(): string {
    return this.constructor.name;
  }

  getDefinition(): StepDefinition {
    const stepDefinition: StepDefinition = new StepDefinition();
    stepDefinition.setStepId(this.getId());
    stepDefinition.setName(this.stepName);
    stepDefinition.setType(this.stepType);
    stepDefinition.setExpression(this.stepExpression);

    this.expectedFields.forEach((field: Field) => {
      const expectedField = new FieldDefinition();
      expectedField.setType(field.type);
      expectedField.setKey(field.field);
      expectedField.setOptionality(FieldDefinition.Optionality.REQUIRED);
      expectedField.setDescription(field.description);
      stepDefinition.addExpectedFields(expectedField);
    });

    return stepDefinition;
  }
}
