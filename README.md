# class-validator-is-nullable

[Русский](README.ru.md)

`@IsNullable()` and `@IsUndefinable()` decorators for [class-validator](https://github.com/typestack/class-validator).

`@IsOptional()` skips other validators when a value is `null` or `undefined`. These decorators split that behavior:

| Decorator | `null` | `undefined` | any other value |
| --- | --- | --- | --- |
| `@IsNullable()` | skip other validators | validate | validate |
| `@IsUndefinable()` | validate | skip other validators | validate |
| both | skip other validators | skip other validators | validate |

Putting both decorators on one property matches `@IsOptional()`.

## Install

```bash
npm install class-validator-is-nullable class-validator reflect-metadata
```

Peer dependencies: `class-validator >= 0.14` and `reflect-metadata >= 0.1.13`. Node.js 18 or newer.

## Setup

Enable legacy decorators in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

Import `reflect-metadata` once, before any decorated class is loaded:

```ts
import "reflect-metadata";
```

Since class-validator 0.14, `forbidUnknownValues` defaults to `true`. Validate class instances. A plain object with no registered metadata is rejected.

## IsNullable

Other validators on the property run only when the value is not `null`.

```ts
import { IsEmail, validate } from "class-validator";
import { IsNullable } from "class-validator-is-nullable";

class Profile {
    @IsNullable()
    @IsEmail()
    email: string | null = null;
}

const profile = new Profile();
await validate(profile); // []

profile.email = "not-an-email";
await validate(profile); // email must be an email
```

`undefined` is still checked. Use `@IsUndefinable()` or `@IsOptional()` when a missing property should pass.

## IsUndefinable

Other validators on the property run only when the value is not `undefined`.

```ts
import { MinLength, validate } from "class-validator";
import { IsUndefinable } from "class-validator-is-nullable";

class Account {
    @IsUndefinable()
    @MinLength(2)
    nickname?: string;
}

const account = new Account();
await validate(account); // []

account.nickname = "a";
await validate(account); // nickname is too short
```

`null` is still checked.

## Both decorators

```ts
import { IsNotEmpty } from "class-validator";
import { IsNullable, IsUndefinable } from "class-validator-is-nullable";

class Article {
    @IsNullable()
    @IsUndefinable()
    @IsNotEmpty()
    title: string | null | undefined;
}
```

`null` and `undefined` pass. Every other value is validated by `@IsNotEmpty()`.

## Groups

`validationOptions` are forwarded to class-validator. A grouped decorator applies when that group is validated:

```ts
import { IsNotEmpty, validate } from "class-validator";
import { IsNullable } from "class-validator-is-nullable";

class Draft {
    @IsNullable({ groups: ["create"] })
    @IsNotEmpty({ always: true })
    title: string | null = null;
}

const draft = new Draft();
await validate(draft, { groups: ["create"] }); // []
await validate(draft, { groups: ["update"] }); // title should not be empty
```

`@IsNotEmpty({ always: true })` still runs for the `update` group. That group leaves `@IsNullable()` out, so `null` is rejected.

## Examples

Runnable scripts live in [`examples/`](examples):

```bash
npm run examples
```

- [`examples/nullable.ts`](examples/nullable.ts) — `string | null`
- [`examples/undefinable.ts`](examples/undefinable.ts) — an optional field
- [`examples/groups.ts`](examples/groups.ts) — validation groups

## License

MIT
