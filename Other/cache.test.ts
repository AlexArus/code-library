import {
    assert,
    assertFalse,
} from "https://deno.land/std@0.223.0/assert/mod.ts";

import { timeLimitedCacheFactory } from './cache.ts';
import { sleep } from './sleep.ts';

Deno.test("Time limited cache test",
    // { sanitizeOps: false, sanitizeResources: false },
    async () => {
        const cache = timeLimitedCacheFactory<string>();

        const key = 'key1';
        const value = 'value1';
        const delayMs = 100;

        cache.set(key, value, delayMs);

        assert(cache.has(key));
        assert(cache.get(key) === value);
        assert(cache.count() === 1);

        await sleep(100);

        assertFalse(cache.has(key));
        assert(cache.get(key) === undefined);
        assert(cache.count() === 0);
    });
