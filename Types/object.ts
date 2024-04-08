/** Get object values types */
export type ObjectValues<T> = T[keyof T];

/** Get object values types (support only object like variables) */
export type ObjectValuesStrict<T extends {}> = T extends Record<any, infer V> ? V : never;

