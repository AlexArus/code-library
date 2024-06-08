import {
    assert,
} from "https://deno.land/std@0.223.0/assert/mod.ts";
import { sleep } from './sleep.ts';
import { debounce } from './debounce.ts';


Deno.test("Debounce test",
    async () => {
        const delayMs = 100;
        let counter = 0;

        const debouncedFn = debounce(() => { counter++; }, delayMs);

        debouncedFn();

        await sleep(delayMs / 2);

        debouncedFn();

        await sleep(delayMs);

        assert(counter === 1);

        debouncedFn();

        await sleep(delayMs);

        assert((counter as number) === 2);
    });
