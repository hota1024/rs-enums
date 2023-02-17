import { None, Opt, Some } from '@/std/Opt'

describe('Option test', () => {
  test('Option.Some', () => {
    const some = Opt.Some(1)

    expect(some.matches('Some')).toBe(true)
  })

  test('Option.None', () => {
    const none = Opt.None()

    expect(none.matches('None')).toBe(true)
  })

  test('Option.isSome', () => {
    const some = Opt.Some(1)
    const none = Opt.None()

    expect(some.isSome()).toBe(true)
    expect(none.isSome()).toBe(false)

    if (some.isSome()) {
      expect(some.takeVariantValue()).toBe(1)
    }
  })

  test('Option.isSomeAnd', () => {
    const some = Opt.Some(1)
    const none = Opt.None()

    expect(some.isSomeAnd((x) => x === 1)).toBe(true)
    expect(some.isSomeAnd((x) => x === 2)).toBe(false)
    expect(none.isSomeAnd((x) => x === 1)).toBe(false)
  })

  test('Option.unwrap', () => {
    const some = Opt.Some(1)
    const none = Opt.None()

    expect(some.unwrap()).toBe(1)
    expect(() => none.unwrap()).toThrowError()
  })

  test('Option.unwrapOr', () => {
    const some = Opt.Some(1)
    const none = Opt.None()

    expect(some.unwrapOr(2)).toBe(1)
    expect(none.unwrapOr(2)).toBe(2)
  })

  test('Option.unwrapElse', () => {
    const some = Opt.Some(1)
    const none = Opt.None()

    expect(some.unwrapElse(() => 2)).toBe(1)
    expect(none.unwrapElse(() => 2)).toBe(2)
  })

  test('Option.map', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.map((x) => x + 1).unwrap()).toBe(2)
    expect(none.map((x) => x + 1).isNone()).toBe(true)
  })

  test('Option.mapOr', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.mapOr(0, (x) => x + 1)).toBe(2)
    expect(none.mapOr(0, (x) => x + 1)).toBe(0)
  })

  test('Option.mapOrElse', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(
      some.mapOrElse(
        () => 0,
        (x) => x + 1
      )
    ).toBe(2)
    expect(
      none.mapOrElse(
        () => 0,
        (x) => x + 1
      )
    ).toBe(0)
  })

  test('Option.and', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.and(Opt.Some(2)).unwrap()).toBe(2)
    expect(some.and(Opt.None()).isNone()).toBe(true)
    expect(none.and(Opt.Some(2)).isNone()).toBe(true)
    expect(none.and(Opt.None()).isNone()).toBe(true)
  })

  test('Option.andThen', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.andThen((x) => Opt.Some(x + 1)).unwrap()).toBe(2)
    expect(some.andThen(() => Opt.None()).isNone()).toBe(true)
    expect(none.andThen((x) => Opt.Some(x + 1)).isNone()).toBe(true)
    expect(none.andThen(() => Opt.None()).isNone()).toBe(true)
  })

  test('Option.contains', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.contains(1)).toBe(true)
    expect(some.contains(2)).toBe(false)
    expect(none.contains(1)).toBe(false)
  })

  test('Option.filter', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.filter((x) => x > 0).unwrap()).toBe(1)
    expect(some.filter((x) => x < 0).isNone()).toBe(true)
    expect(none.filter((x) => x > 0).isNone()).toBe(true)
  })

  test('Option.flatten', () => {
    const a = Opt.Some(Opt.Some(6))
    expect(a.flatten().unwrap()).toBe(6)

    const b = Opt.Some(Opt.None())
    expect(b.flatten().isNone()).toBeTruthy()

    const c = Opt.None()
    expect(c.flatten().isNone()).toBeTruthy()
  })

  test('Option.inspect', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    const mock = jest.fn((x: number) => x + 1)

    expect(some.inspect(mock)).toBe(some)
    expect(none.inspect(mock)).toBe(none)

    expect(mock.mock.calls.length).toBe(1)
    expect(mock.mock.calls[0][0]).toBe(1)
  })

  test('Option.or', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.or(Opt.Some(2)).unwrap()).toBe(1)
    expect(some.or(Opt.None()).unwrap()).toBe(1)
    expect(none.or(Opt.Some(2)).unwrap()).toBe(2)
    expect(none.or(Opt.None()).isNone()).toBe(true)
  })

  test('Option.orElse', () => {
    const some = Opt.Some(1)
    const none = Opt.None<number>()

    expect(some.orElse(() => Opt.Some(2)).unwrap()).toBe(1)
    expect(some.orElse(() => Opt.None()).unwrap()).toBe(1)
    expect(none.orElse(() => Opt.Some(2)).unwrap()).toBe(2)
    expect(none.orElse(() => Opt.None()).isNone()).toBe(true)
  })

  test('Option.xor', () => {
    const some = Some(2)
    const none = None<number>()

    expect(some.xor(none)).toStrictEqual(some)
    expect(none.xor(some)).toStrictEqual(some)
    expect(some.xor(some.clone()).isNone()).toBe(true)
    expect(none.xor(none).isNone()).toBe(true)
  })

  test('Option.zip', () => {
    const x = Some(1)
    const y = Some('hi')
    const z = None<number>()

    expect(x.zip(y).unwrap()).toEqual([1, 'hi'])
    expect(x.zip(z).isNone()).toBe(true)
  })

  test('Option.zipWith', () => {
    const x = Some(1)
    const y = Some('hi')
    const z = None<number>()

    expect(x.zipWith(y, (a, b) => a + b).unwrap()).toBe('1hi')
    expect(x.zipWith(z, (a, b) => a + b).isNone()).toBe(true)
  })
})
