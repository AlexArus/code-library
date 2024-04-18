import {
  assert,
  assertFalse,
} from "https://deno.land/std@0.223.0/assert/mod.ts";

import { isEmail } from "./validations.ts";

Deno.test("Email validation test", async (t) => {
  await t.step("valid email", async (t) => {
    const testCases = [
      ["user@domain.net", "default"],
      ["Test.User@domain.net", "user name with dot"],
      ["Test-User@domain.net", "user name with hyphen"],
      ["Test_User@domain.net", "user name with underscore"],
      ["User@subdomain.domanin.net", "domain with subdomain"],
      ["123User@domain.net", "user name with numbers at begining"],
      ["user123@domain.net", "user name with numbers at ending"],
      ["test.User-12_3@subdomain.domain.net", "everything"],
    ];

    for (const [email, description] of testCases) {
      await t.step(description, () => assert(isEmail(email)));
    }
  });

  await t.step("invalid email", async (t) => {
    const testCases = [
      ["domain.net", "without user name"],
      ["user@ .net", "space instead of domain name"],
      ["testUsernet", "without @ and domain"],
      ["user@test domain.net", "domain with space"],
      ["user@", "only user with @"],
      ["test User@domain.net", "user name with space"],
      ["user@domain..net", "domain with two dots sequence"],
      ["user@domain,ru", "comma instead of dot"],
      ["user..", "user with two dots sequence"],
      ["@domain.net", "without user name"],
      ["user@domainnet", "domain without dot"],
      ["test@User@domain.net", "several @ symbols"],
      ["user.@domain.net", "dot at the end of user name"],
      ["user@domain-.net", "hyphen at the end of domain name"],
    ];

    for (const [email, description] of testCases) {
      await t.step(description, () => assertFalse(isEmail(email)));
    }
  });
});
