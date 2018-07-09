import { MetadataStorage, ValidationOptions, ValidationTypes, getFromContainer } from "class-validator";

import { ValidationMetadata } from "class-validator/metadata/ValidationMetadata";
import { ValidationMetadataArgs } from "class-validator/metadata/ValidationMetadataArgs";

export function IsNullable(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [(object: any, value: any) => object[propertyName] !== null],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

