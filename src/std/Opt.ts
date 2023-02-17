import { Enum, EnumNarrowed, EnumNarrowSelector } from '@/enum'
import { Err, Ok, Result } from './Result'

type OptVariants<T> = {
  Some: T
  None: null
}

/**
 * Option enum.
 */
export class Opt<
  T,
  K extends EnumNarrowSelector<OptVariants<T>> = unknown
> extends Enum<OptVariants<T>, K> {
  /**
   * generates an option with the given value.
   *
   * @param value value to wrap in an Option.
   * @returns option with the given value.
   */
  static Some<T>(value: T): Opt<T> {
    return new Opt('Some', value)
  }

  /**
   * generates an option with no value.
   *
   * @returns option with no value.
   */
  static None<T>(): Opt<T> {
    return new Opt<T>('None', null)
  }

  /**
   * returns clone of the option.
   *
   * @returns clone of the option.
   */
  clone(): Opt<T, K> {
    return new Opt(this.getVariant(), this.takeVariantValue())
  }

  /**
   * returns whether the option is a Some.
   *
   * @returns whether the option is a Some.
   */
  isSome(): this is EnumNarrowed<this, OptVariants<T>, 'Some'> {
    return this.matches('Some')
  }

  isSomeAnd(fn: (value: T) => boolean): boolean {
    return this.isSome() && fn(this.unwrap())
  }

  /**
   * returns whether the option is a None.
   *
   * @returns whether the option is a None.
   */
  isNone(): this is EnumNarrowed<this, OptVariants<T>, 'None'> {
    return this.matches('None')
  }

  /**
   * returns the contained Some value. if the option is a None, throws an error.
   *
   * @returns unwrapped value of the option.
   */
  unwrap(): T {
    return this.match({
      Some: (value) => value,
      None: () => {
        throw new Error('cannot unwrap None')
      },
    })
  }

  /**
   * returns the contained Some value. if the option is a None, returns the given default value.
   *
   * @param value default value to return if the option is a None.
   * @returns the contained Some value or the given default value.
   */
  unwrapOr(value: T): T {
    return this.match({
      Some: (value) => value,
      None: () => value,
    })
  }

  /**
   * returns the contained Some value. if the option is a None, computes it from the given function.
   *
   * @param fn function to call if the option is a None.
   * @returns the contained Some value or computes it from the given function.
   */
  unwrapElse(fn: () => T): T {
    return this.match({
      Some: (value) => value,
      None: () => fn(),
    })
  }

  /**
   * maps an `Opt<T>` to `Opt<U>` by applying a function to a contained value.
   *
   * @param fn function to call if the option is a Some.
   */
  map<U>(fn: (value: T) => U): Opt<U> {
    return this.match({
      Some: (value) => Opt.Some<U>(fn(value)) as Opt<U>,
      None: () => Opt.None<U>() as Opt<U>,
    })
  }

  /**
   * returns the provided default value if the option is a None, otherwise returns the contained value.
   *
   * @param value default value to return if the option is a None.
   * @param fn function to call if the option is a Some.
   */
  mapOr<U>(value: U, fn: (value: T) => U): U {
    return this.match({
      Some: (value) => fn(value),
      None: () => value,
    })
  }

  /**
   * returns the result of the provided function if the option is a None, otherwise returns the contained value.
   *
   * @param defaultFn function to call if the option is a None.
   * @param fn function to call if the option is a Some.
   */
  mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U {
    return this.match({
      Some: (value) => fn(value),
      None: () => defaultFn(),
    })
  }

  and<U>(opt: Opt<U>): Opt<U> {
    return this.match({
      Some: () => opt.clone(),
      None: () => Opt.None<U>(),
    })
  }

  andThen<U>(fn: (value: T) => Opt<U>): Opt<U> {
    return this.match({
      Some: (value) => fn(value),
      None: () => Opt.None<U>(),
    })
  }

  contains(value: T): boolean {
    return this.match({
      Some: (v) => v === value,
      None: () => false,
    })
  }

  filter(predicate: (value: T) => boolean): Opt<T> {
    return this.match({
      Some: (value) => (predicate(value) ? this.clone() : Opt.None<T>()),
      None: () => Opt.None<T>(),
    })
  }

  flatten(): Opt<T> {
    return this.match({
      Some: (value) => {
        if (value instanceof Opt) {
          return value as Opt<T>
        } else {
          return Opt.Some<T>(value)
        }
      },
      None: () => Opt.None<T>(),
    })
  }

  inspect(fn: (value: T) => void): Opt<T> {
    this.match({
      Some: (value) => fn(value),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      None: () => {},
    })

    return this
  }

  or(opt: Opt<T>): Opt<T> {
    return this.match({
      Some: () => this.clone(),
      None: () => opt.clone(),
    })
  }

  orElse(fn: () => Opt<T>): Opt<T> {
    return this.match({
      Some: () => this.clone(),
      None: () => fn(),
    })
  }

  xor(opt: Opt<T>): Opt<T> {
    if (this.isSome() && !opt.isSome()) {
      return this.clone()
    } else if (opt.isSome() && !this.isSome()) {
      return opt.clone()
    } else {
      return None<T>()
    }
  }

  zip<U>(opt: Opt<U>): Opt<[T, U]> {
    return this.match({
      Some: (value) => opt.map((value2) => [value, value2]),
      None: () => None<[T, U]>(),
    })
  }

  zipWith<U, V>(opt: Opt<U>, fn: (value: T, value2: U) => V): Opt<V> {
    return this.match({
      Some: (value) => opt.map((value2) => fn(value, value2)),
      None: () => None<V>(),
    })
  }

  ok_or<E>(err: E): Result<T, E> {
    return this.match({
      Some: (value) => Ok<T, E>(value),
      None: () => Err<T, E>(err),
    })
  }

  ok_or_else<E>(fn: () => E): Result<T, E> {
    return this.match({
      Some: (value) => Ok<T, E>(value),
      None: () => Err<T, E>(fn()),
    })
  }
}

export const Some = Opt.Some
export const None = Opt.None
