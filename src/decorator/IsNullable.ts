import { ValidateIf, ValidationOptions } from "class-validator";

/**
 * Skips every other validator on the property when the value is `null`.
 * `undefined` is still validated.
 */
export function IsNullable(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: object, propertyName: string | symbol): void {
        ValidateIf((target: object) => {
            return (target as Record<string | symbol, unknown>)[propertyName] !== null;
        }, validationOptions)(object, propertyName);
    };
}
