<h2 align="center">🦀 rs-enums 🏷️</h2>
<p align="center">rust-like enums for TypeScript</p></p>

## ➕ Installation

```shell
# yarn
yarn add rs-enums

# npm
npm install rs-enums

# pnpm
pnpm install rs-enums
```

## ✨ Usage

### `Opt<T>`

[`std::option::Option<T>`](https://doc.rust-lang.org/stable/std/option/enum.Option.html#)

```ts
import { Opt, Some, None } from 'rs-enums'

// generate Opt<T> with Some<T> and None<T>
const some = Some('hi')
const none = None<string>()

// Opt<T>#unwrap(): T
console.log(some.unwrap()) // 'hi'
none.unwrap() // throws an error because cannot unwrap None
```

### `Result<T, E>`

[`std::result::Result<T, E>`](https://doc.rust-lang.org/stable/std/result/enum.Result.html)

```ts
import { Result, Ok, Err } from 'rs-enums'

// generates Result<T, E> with Ok<T, E> and Err<T, E>
const ok = Ok<string, string>('success')
const err = Err<string, string>('error')

console.log(ok.expect('should be ok')) // 'success'
err.expect('should be ok') // throws an error with message 'should be ok'
```
