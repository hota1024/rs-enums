/**
 * Enum class.
 */
export class Enum<
  V,
  K extends EnumNarrowSelector<V> = unknown,
  NV extends V[keyof V] = K extends keyof V ? V[K] : V[keyof V]
> {
  #variant: K
  #value: NV

  /**
   * constructs a new enum instance.
   *
   * @param variant variant of the enum.
   * @param value value of the enum variant.
   */
  constructor(variant: K, value: NV) {
    this.#variant = variant
    this.#value = value
  }

  /**
   * returns whether the enum variant matches the given variant.
   *
   * @param variant variant to check against.
   * @returns whether the enum variant matches the given variant.
   */
  matches<K extends keyof V>(variant: K): this is EnumNarrowed<this, V, K> {
    return (this.#variant as unknown as K) === variant
  }
  // matches<K extends keyof V>(
  //   variant: K
  // ): this is Omit<this, EnumFieldKeys> & Enum<V, K, V[K]> {
  //   return (this.#variant as unknown as K) === variant
  // }

  /**
   * matches the enum against the given arms.
   *
   * @param arms arms to match against.
   * @returns result of the matched arm.
   */
  match<T>(arms: EnumMatchArms<V, T>): Exclude<T, never> {
    const arm = arms[this.#variant as keyof V]

    if (arm) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return arm(this.#value as any)
    }

    if ((arms as { _: () => T })._) {
      return (arms as { _: () => T })._()
    }

    throw new Error(`no arm for variant \`${this.#variant}\`}`)
  }

  /**
   * returns the variant of the enum.
   *
   * @returns The variant of the enum.
   */
  getVariant(): K {
    return this.#variant
  }

  /**
   * returns the value of the enum variant.
   *
   * @returns The value of the enum variant.
   */
  takeVariantValue(): NV {
    return this.#value
  }
}

export type EnumNarrowSelector<V> = unknown | keyof V
export type EnumNarrowed<E, V, K extends keyof V> = Omit<E, EnumFieldKeys> &
  Enum<V, K>

type EnumMatchArms<V, T> =
  | {
      [K in keyof V]: (value: V[K]) => T
    }
  | ({
      [K in keyof V]?: (value: V[K]) => T
    } & {
      _: () => T
    })

type EnumFieldKeys = keyof Enum<unknown>
