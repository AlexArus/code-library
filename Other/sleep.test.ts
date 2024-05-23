import {
    assert,
} from "https://deno.land/std@0.223.0/assert/mod.ts";
import { sleep } from './sleep.ts';


Deno.test("Sleep test",
    async () => {
        const delayMs = 100;
        const start = Date.now();

        await sleep(delayMs);

        const end = Date.now();

        assert(end - start >= delayMs);
    });
