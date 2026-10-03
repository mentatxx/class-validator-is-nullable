import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

import { IsNullable } from "../src";
import { expectErrors, expectNotEmpty } from "./expect-errors";

describe("IsNullable", () => {
    it("should not validate a property when the value is null", async () => {
        class MyClass {
            @IsNullable()
            @IsNotEmpty()
            title: string | null = null;
        }

        const model = new MyClass();
        await expectErrors(model, errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should validate a property when the value is not null", async () => {
        class MyClass {
            @IsNullable()
            @IsNotEmpty()
            title: string | null = "";
        }

        const model = new MyClass();
        await expectErrors(model, errors => {
            assert.equal(errors[0].target, model);
            expectNotEmpty(errors, "title", "");
        });
    });

    it("should still validate undefined", async () => {
        class MyClass {
            @IsNullable()
            @IsNotEmpty()
            title: string | null | undefined = undefined;
        }

        await expectErrors(new MyClass(), errors => {
            expectNotEmpty(errors, "title", undefined);
        });
    });

    it("should accept a valid string", async () => {
        class MyClass {
            @IsNullable()
            @IsNotEmpty()
            title: string | null = "ok";
        }

        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should skip every other validator when the value is null", async () => {
        class MyClass {
            @IsNullable()
            @IsString()
            @MinLength(2)
            title: string | null = null;
        }

        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should run every other validator when the value is not null", async () => {
        class MyClass {
            @IsNullable()
            @IsString()
            @MinLength(2)
            title: string | null = "a";
        }

        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 1);
            assert.equal(errors[0].property, "title");
            assert.equal(errors[0].value, "a");
            assert.deepEqual(errors[0].constraints, {
                minLength: "title must be longer than or equal to 2 characters"
            });
        });
    });

    it("should apply the null skip only for the given group", async () => {
        class MyClass {
            @IsNullable({ groups: ["create"] })
            @IsNotEmpty({ always: true })
            title: string | null = null;
        }

        const skipped = new MyClass();
        await expectErrors(skipped, errors => {
            assert.equal(errors.length, 0);
        }, { groups: ["create"] });

        const checked = new MyClass();
        await expectErrors(checked, errors => {
            expectNotEmpty(errors, "title", null);
        }, { groups: ["update"] });

        const empty = new MyClass();
        empty.title = "";
        await expectErrors(empty, errors => {
            expectNotEmpty(errors, "title", "");
        }, { groups: ["create"] });
    });
});
