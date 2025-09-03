export type TypedConstructor<I> = new (...args: any[]) => I;

export type Constructor = new (...args: any[]) => any;
