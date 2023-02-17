import { None, Some } from '@/std/Opt'
import { Err, Ok, Result } from '@/std/Result'

describe('Result test', () => {
  test('Result.Ok', () => {
    const ok = Result.Ok(1)

    expect(ok.matches('Ok')).toBe(true)
  })

  test('Result.Err', () => {
    const err = Result.Err('error')

    expect(err.matches('Err')).toBe(true)
  })

  test('Result.and', () => {
    const x1 = Ok<number, string>(2)
    const y1 = Err<number, string>('error')
    expect(x1.and(y1)).toStrictEqual(Err('error'))

    const x2 = Err<number, string>('error')
    const y2 = Ok<number, string>(2)
    expect(x2.and(y2)).toStrictEqual(Err('error'))

    const x3 = Err<number, string>('not a 2')
    const y3 = Err<number, string>('error')
    expect(x3.and(y3)).toStrictEqual(Err('not a 2'))

    const x4 = Ok<number, string>(2)
    const y4 = Ok<string, string>('different result type')
    expect(x4.and(y4)).toStrictEqual(Ok('different result type'))
  })

  test('Result.andThen', () => {
    const x1 = Ok<number, string>(2)
    const y1 = Err<number, string>('error')
    expect(x1.andThen(() => y1)).toStrictEqual(Err('error'))

    const x2 = Err<number, string>('error')
    const y2 = Ok<number, string>(2)
    expect(x2.andThen(() => y2)).toStrictEqual(Err('error'))

    const x3 = Err<number, string>('not a 2')
    const y3 = Err<number, string>('error')
    expect(x3.andThen(() => y3)).toStrictEqual(Err('not a 2'))

    const x4 = Ok<number, string>(2)
    const y4 = Ok<string, string>('different result type')
    expect(x4.andThen(() => y4)).toStrictEqual(Ok('different result type'))
  })

  test('Result.or', () => {
    const x1 = Ok<number, string>(2)
    const y1 = Err<number, string>('error')
    expect(x1.or(y1)).toStrictEqual(Ok(2))

    const x2 = Err<number, string>('error')
    const y2 = Ok<number, string>(2)
    expect(x2.or(y2)).toStrictEqual(Ok(2))

    const x3 = Err<number, string>('not a 2')
    const y3 = Err<number, string>('error')
    expect(x3.or(y3)).toStrictEqual(Err('error'))

    const x4 = Ok<number, string>(2)
    const y4 = Ok<string, string>('different result type')
    expect(x4.or(y4)).toStrictEqual(Ok(2))
  })

  test('Result.orElse', () => {
    const x1 = Ok<number, string>(2)
    const y1 = Err<number, string>('error')
    expect(x1.orElse(() => y1)).toStrictEqual(Ok(2))

    const x2 = Err<number, string>('error')
    const y2 = Ok<number, string>(2)
    expect(x2.orElse(() => y2)).toStrictEqual(Ok(2))

    const x3 = Err<number, string>('not a 2')
    const y3 = Err<number, string>('error')
    expect(x3.orElse(() => y3)).toStrictEqual(Err('error'))

    const x4 = Ok<number, string>(2)
    const y4 = Ok<string, string>('different result type')
    expect(x4.orElse(() => y4)).toStrictEqual(Ok(2))
  })

  test('Result.unwrapOr', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.unwrapOr(3)).toBe(2)

    const x2 = Err<number, string>('error')
    expect(x2.unwrapOr(3)).toBe(3)
  })

  test('Result.unwrapOrElse', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.unwrapOrElse(() => 3)).toBe(2)

    const x2 = Err<number, string>('error')
    expect(x2.unwrapOrElse(() => 3)).toBe(3)
  })

  test('Result.contains', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.contains(2)).toBe(true)

    const x2 = Err<number, string>('error')
    expect(x2.contains(2)).toBe(false)
  })

  test('Result.containsErr', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.containsErr('error')).toBe(false)

    const x2 = Err<number, string>('error')
    expect(x2.containsErr('error')).toBe(true)
  })

  test('Result.err', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.err()).toStrictEqual(None())

    const x2 = Err<number, string>('error')
    expect(x2.err()).toStrictEqual(Some('error'))
  })

  test('Result.expect', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.expect('error')).toBe(2)

    const x2 = Err<number, string>('error')
    expect(() => x2.expect('error')).toThrow('error')
  })

  test('Result.expectErr', () => {
    const x1 = Ok<number, string>(2)
    expect(() => x1.expectErr('error')).toThrow('error')

    const x2 = Err<number, string>('error')
    expect(x2.expectErr('error')).toBe('error')
  })

  test('Result.inspect', () => {
    const ok = Ok<number, string>(1)
    const err = Err<number, string>('error')

    const mock = jest.fn((x: number) => x + 1)

    expect(ok.inspect(mock)).toBe(ok)
    expect(err.inspect(mock)).toBe(err)

    expect(mock.mock.calls.length).toBe(1)
    expect(mock.mock.calls[0][0]).toBe(1)
  })

  test('Result.inspectErr', () => {
    const ok = Ok<number, string>(1)
    const err = Err<number, string>('error')

    const mock = jest.fn((x: string) => x)

    expect(ok.inspectErr(mock)).toBe(ok)
    expect(err.inspectErr(mock)).toBe(err)

    expect(mock.mock.calls.length).toBe(1)
    expect(mock.mock.calls[0][0]).toBe('error')
  })

  test('Result.isOk', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.isOk()).toBe(true)

    const x2 = Err<number, string>('error')
    expect(x2.isOk()).toBe(false)
  })

  test('Result.isErr', () => {
    const x1 = Ok<number, string>(2)
    expect(x1.isErr()).toBe(false)

    const x2 = Err<number, string>('error')
    expect(x2.isErr()).toBe(true)
  })
})
