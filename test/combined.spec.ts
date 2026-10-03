import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IsNotEmpty } from "class-validator";

import { IsNullable, IsUndefinable } from "../src";
import { expectErrors, expectNotEmpty } from "./expect-errors";

describe("IsNullable and IsUndefinable", () => {
    class MyClass {
        @IsNullable()
        @IsUndefinable()
        @IsNotEmpty()
        title: string | null | undefined = undefined;
    }

    it("should skip validators when the value is null", async () => {
        const model = new MyClass();
        model.title = null;
        await expectErrors(model, errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should skip validators when the value is undefined", async () => {
        await expectErrors(new MyClass(), errors => {
            assert.equal(errors.length, 0);
        });
    });

    it("should validate a defined non-null value", async () => {
        const empty = new MyClass();
        empty.title = "";
        await expectErrors(empty, errors => {
            expectNotEmpty(errors, "title", "");
        });

        const filled = new MyClass();
        filled.title = "ok";
        await expectErrors(filled, errors => {
            assert.equal(errors.length, 0);
        });
    });
});
