import "reflect-metadata";
import { MinLength, validate, ValidationError } from "class-validator";

import { IsUndefinable } from "../src";

class Account {
    @IsUndefinable()
    @MinLength(2)
    nickname?: string;
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
    const omitted = new Account();
    report("omitted nickname", await validate(omitted));

    const short = new Account();
    short.nickname = "a";
    report("short nickname", await validate(short));

    const present = new Account();
    present.nickname = "alex";
    report("present nickname", await validate(present));
}

main();
