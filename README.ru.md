# class-validator-is-nullable

[English](README.md)

Декораторы `@IsNullable()` и `@IsUndefinable()` для [class-validator](https://github.com/typestack/class-validator).

`@IsOptional()` пропускает остальные валидаторы, когда значение равно `null` или `undefined`. Эти декораторы разделяют это поведение:

| Декоратор | `null` | `undefined` | любое другое значение |
| --- | --- | --- | --- |
| `@IsNullable()` | пропустить остальные валидаторы | проверить | проверить |
| `@IsUndefinable()` | проверить | пропустить остальные валидаторы | проверить |
| оба | пропустить остальные валидаторы | пропустить остальные валидаторы | проверить |

Оба декоратора на одном свойстве совпадают с `@IsOptional()`.

## Установка

```bash
npm install class-validator-is-nullable class-validator reflect-metadata
```

Peer-зависимости: `class-validator >= 0.14` и `reflect-metadata >= 0.1.13`. Node.js 18 или новее.

## Настройка

Включите legacy-декораторы в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

Импортируйте `reflect-metadata` один раз, до загрузки любого класса с декораторами:

```ts
import "reflect-metadata";
```

Начиная с class-validator 0.14, `forbidUnknownValues` по умолчанию равен `true`. Проверяйте экземпляры класса. Обычный объект без зарегистрированных метаданных будет отклонён.

## IsNullable

Остальные валидаторы свойства выполняются, когда значение отлично от `null`.

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

Значение `undefined` тоже проверяется. Чтобы отсутствующее свойство проходило проверку, используйте `@IsUndefinable()` или `@IsOptional()`.

## IsUndefinable

Остальные валидаторы свойства выполняются, когда значение отлично от `undefined`.

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

Значение `null` тоже проверяется.

## Оба декоратора

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

`null` и `undefined` проходят проверку. Любое другое значение проверяет `@IsNotEmpty()`.

## Группы

`validationOptions` передаются в class-validator. Декоратор с группой применяется, когда валидация идёт в этой группе:

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

`@IsNotEmpty({ always: true })` выполняется и для группы `update`. В этой группе `@IsNullable()` не участвует, поэтому `null` отклоняется.

## Примеры

Запускаемые скрипты лежат в [`examples/`](examples):

```bash
npm run examples
```

- [`examples/nullable.ts`](examples/nullable.ts) — поле `string | null`
- [`examples/undefinable.ts`](examples/undefinable.ts) — необязательное поле
- [`examples/groups.ts`](examples/groups.ts) — группы валидации

## Лицензия

MIT
