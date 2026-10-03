import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

import { IsUndefinable } from "../src";
import { expectErrors, expectNotEmpty } from "./expect-errors";

describe("IsUndefinable", () => {
    it("should not validate a property when the value is undefined", async () => {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string | undefined = undefined;
        }

        const model = new MyClass();
        await expectErrors(model, errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should validate a property when the value is defined", async () => {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string | undefined = "";
        }

        const model = new MyClass();
        await expectErrors(model, errors => {
            assert.equal(errors[0].target, model);
            expectNotEmpty(errors, "title", "");
        });
    });

    it("should still validate null", async () => {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string | null | undefined = null;
        }

        await expectErrors(new MyClass(), errors => {
            expectNotEmpty(errors, "title", null);
        });
    });

    it("should accept a valid string", async () => {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string | undefined = "ok";
        }

        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should skip every other validator when the value is undefined", async () => {
        class MyClass {
            @IsUndefinable()
            @IsString()
            @MinLength(2)
            title: string | undefined = undefined;
        }

        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should run every other validator when the value is defined", async () => {
        class MyClass {
            @IsUndefinable()
            @IsString()
            @MinLength(2)
            title: string | undefined = "a";
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

    it("should apply the undefined skip only for the given group", async () => {
        class MyClass {
            @IsUndefinable({ groups: ["create"] })
            @IsNotEmpty({ always: true })
            title: string | undefined = undefined;
        }

        const skipped = new MyClass();
        await expectErrors(skipped, errors => {
            assert.equal(errors.length, 0);
        }, { groups: ["create"] });

        const checked = new MyClass();
        await expectErrors(checked, errors => {
            expectNotEmpty(errors, "title", undefined);
        }, { groups: ["update"] });

        const empty = new MyClass();
        empty.title = "";
        await expectErrors(empty, errors => {
            expectNotEmpty(errors, "title", "");
        }, { groups: ["create"] });
    });
});
