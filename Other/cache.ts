export const timeLimitedCacheFactory = <T>() => {

    const store = new Map<string, { value: T, timerId: number }>();

    return {
        set(key: string, value: T, duration: number) {
            const timerId = store.get(key)?.timerId;
            timerId && clearTimeout(timerId);

            store.set(key, {
                value,
                timerId: setTimeout(() => store.delete(key), duration),
            });
        },

        has(key: string): boolean {
            return store.has(key);
        },

        get(key: string): T | undefined {
            return store.has(key) ? store.get(key)!.value : undefined;
        },

        count(): number {
            return store.size;
        }
    }

}