/** Get type of array elements (accept any object, doesn't work with readonly arrays) */
export type ArrayElementSimple<T> = T extends Array<infer V> ? V : never;

/** Get type of array elements (accept only arrays) */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/** Get type of array elements (accept any object, if object is not array return never) */
export type ArrayElementOfAny<ArrayType> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
