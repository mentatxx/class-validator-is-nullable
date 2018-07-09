import "es6-shim";
import "mocha";

import { IsNotEmpty, Validator } from "class-validator";

import { IsUndefinable } from "../src";
import { expect } from "chai";

const validator = new Validator();

describe("IsUndefinable", function () {
    it("shouldn't validate a property when field is undefined", function () {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string = undefined;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            expect(errors.length).to.equal(0);
        });
    });

    it("should validate a property when field is defined", function () {
        class MyClass {
            @IsUndefinable()
            @IsNotEmpty()
            title: string = "";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            expect(errors.length).to.equal(1);
            expect(errors[0].target).to.equal(model);
            expect(errors[0].property).to.equal("title");
            expect(errors[0].constraints).to.eql({ isNotEmpty: "title should not be empty" });
            expect(errors[0].value).to.equal("");
        });
    });
});
