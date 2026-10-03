import "reflect-metadata";
import { IsNotEmpty, validate, ValidationError } from "class-validator";

import { IsNullable } from "../src";

class Draft {
    @IsNullable({ groups: ["create"] })
    @IsNotEmpty({ always: true })
    title: string | null = null;
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
    const draft = new Draft();
    report("null title, create group", await validate(draft, { groups: ["create"] }));
    report("null title, update group", await validate(draft, { groups: ["update"] }));

    draft.title = "";
    report("empty title, create group", await validate(draft, { groups: ["create"] }));

    draft.title = "Notes";
    report("filled title, create group", await validate(draft, { groups: ["create"] }));
}

main();
