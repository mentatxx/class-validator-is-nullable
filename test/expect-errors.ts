import assert from "node:assert/strict";
import { validate, validateSync, ValidationError, ValidatorOptions } from "class-validator";

export async function expectErrors(
    model: object,
    check: (errors: ValidationError[]) => void,
    options?: ValidatorOptions
): Promise<void> {
    for (const errors of [await validate(model, options), validateSync(model, options)]) {
        check(errors);
    }
}

export function expectNotEmpty(errors: ValidationError[], property: string, value: unknown): void {
    assert.equal(errors.length, 1);
    assert.equal(errors[0].property, property);
    assert.equal(errors[0].value, value);
    assert.deepEqual(errors[0].constraints, { isNotEmpty: `${property} should not be empty` });
}
