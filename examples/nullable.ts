import "reflect-metadata";
import { IsEmail, validate, ValidationError } from "class-validator";

import { IsNullable } from "../src";

class Profile {
    @IsNullable()
    @IsEmail()
    email: string | null = null;
}

function report(label: string, errors: ValidationError[]): void {
    if (errors.length === 0) {
        console.log(`${label}: valid`);
        return;
    }

    for (const error of errors) {
        console.log(`${label}: ${error.property} ${JSON.stringify(error.constraints)}`);
    }
}

async function main(): Promise<void> {
    const missing = new Profile();
    report("null email", await validate(missing));

    const invalid = new Profile();
    invalid.email = "not-an-email";
    report("invalid email", await validate(invalid));

    const valid = new Profile();
    valid.email = "user@example.com";
    report("valid email", await validate(valid));
}

main();
