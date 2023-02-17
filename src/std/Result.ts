import { Enum, EnumNarrowed, EnumNarrowSelector } from '@/enum'
import { None, Opt, Some } from './Opt'

type ResultVariants<T, E> = {
  Ok: T
  Err: E
}

export class Result<
  T,
  E,
  K extends EnumNarrowSelector<ResultVariants<T, E>> = unknown
> extends Enum<ResultVariants<T, E>, K> {
  static Ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>('Ok', value)
  }

  static Err<T, E>(err: E): Result<T, E> {
    return new Result<T, E>('Err', err)
  }

  clone(): Result<T, E, K> {
    return new Result(this.getVariant(), this.takeVariantValue())
  }

  and<U = T>(res: Result<U, E>): Result<U, E> {
    return this.match({
      Ok: () =>
        res.match({
          Ok: (value) => Ok(value) as Result<U, E>,
          Err: (err) => Err(err) as Result<U, E>,
        }),
      Err: () => this.clone() as unknown as Result<U, E>,
    })
  }

  andThen<U = T>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.match({
      Ok: (value) => fn(value),
      Err: () => this.clone() as unknown as Result<U, E>,
    })
  }

  or<U = T>(res: Result<U, E>): Result<U, E> {
    return this.match({
      Ok: () => this.clone() as unknown as Result<U, E>,
      Err: () =>
        res.match({
          Ok: (value) => Ok(value) as Result<U, E>,
          Err: (err) => Err(err) as Result<U, E>,
        }),
    })
  }

  orElse<U = T>(fn: (err: E) => Result<U, E>): Result<U, E> {
    return this.match({
      Ok: () => this.clone() as unknown as Result<U, E>,
      Err: (err) => fn(err),
    })
  }

  unwrapOrThrow(): T {
    return this.match({
      Ok: (value) => value,
      Err: (err) => {
        throw err
      },
    })
  }

  unwrap(): T {
    return this.match({
      Ok: (value) => value,
      Err: () => {
        throw new Error('cannot unwrap Err')
      },
    })
  }

  unwrapOr(value: T): T {
    return this.match({
      Ok: (value) => value,
      Err: () => value,
    })
  }

  unwrapOrElse(fn: (err: E) => T): T {
    return this.match({
      Ok: (value) => value,
      Err: (err) => fn(err),
    })
  }

  contains(value: T): boolean {
    return this.match({
      Ok: (v) => v === value,
      Err: () => false,
    })
  }

  containsErr(err: E): boolean {
    return this.match({
      Ok: () => false,
      Err: (e) => e === err,
    })
  }

  ok(): Opt<T> {
    return this.match({
      Ok: (value) => Some(value) as Opt<T>,
      Err: () => None() as Opt<T>,
    })
  }

  err(): Opt<E> {
    return this.match({
      Ok: () => None() as Opt<E>,
      Err: (err) => Some(err) as Opt<E>,
    })
  }

  expect(err: string | Error): T {
    return this.match({
      Ok: (value) => value,
      Err: () => {
        throw typeof err === 'string' ? new Error(err) : err
      },
    })
  }

  expectErr(err: string | Error): E {
    return this.match({
      Ok: () => {
        throw typeof err === 'string' ? new Error(err) : err
      },
      Err: (err) => err,
    })
  }

  inspect(fn: (value: T) => void): this {
    return this.match({
      Ok: (value) => {
        fn(value)
        return this
      },
      Err: () => this,
    })
  }

  inspectErr(fn: (err: E) => void): this {
    return this.match({
      Ok: () => this,
      Err: (err) => {
        fn(err)
        return this
      },
    })
  }

  isOk(): this is EnumNarrowed<this, ResultVariants<T, E>, 'Ok'> {
    return this.matches('Ok')
  }

  isOkAnd(fn: (value: T) => boolean): boolean {
    return this.match({
      Ok: (value) => fn(value),
      Err: () => false,
    })
  }

  isErr(): this is EnumNarrowed<this, ResultVariants<T, E>, 'Err'> {
    return this.matches('Err')
  }

  isErrAnd(fn: (err: E) => boolean): boolean {
    return this.match({
      Ok: () => false,
      Err: (err) => fn(err),
    })
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.match({
      Ok: (value) => Ok(fn(value)) as Result<U, E>,
      Err: () => this.clone() as unknown as Result<U, E>,
    })
  }

  mapOr<U>(value: U, fn: (value: T) => U): U {
    return this.match({
      Ok: (value) => fn(value),
      Err: () => value,
    })
  }

  mapOrElse<U>(defaultFn: (err: E) => U, fn: (value: T) => U): U {
    return this.match({
      Ok: (value) => fn(value),
      Err: (err) => defaultFn(err),
    })
  }

  mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return this.match({
      Ok: () => this.clone() as unknown as Result<T, F>,
      Err: (err) => Err(fn(err)) as Result<T, F>,
    })
  }
}

export const Ok = Result.Ok
export const Err = Result.Err
