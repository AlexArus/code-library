import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";

import { createAction, createStateManager } from "./stateManager.ts";
import { ActionAny } from './stateManager.type.ts';

const test1 = "test1";
const test2 = "test2";
const test3 = "test3";
const test4 = "test4";
const test5 = "test5";
const test6 = "test6";
const test7 = "test7";

Deno.test("State Manager", async (tst) => {
  const effectQueue: Array<ActionAny> = [];
  const subscriberQueue: Array<ActionAny> = [];

  const action1 = createAction("action1");
  const action2 = createAction<"action2", string>("action2");

  const stateManager = createStateManager(
    { value: "" },
    (action, state) => {
      if (action1.is(action)) {
        state.value = test1;
      }
      if (action2.is(action)) {
        state.value = action.payload;
      }
    },
    async (action, state) => {
      effectQueue.push(action);
    },
  );
  stateManager.subscribe((action, state) => {
    subscriberQueue.push(action);
  });

  await tst.step("actions", async () => {
    const action3 = stateManager.createAction<"action3", string>(
      "action3",
      (action, state) => state.value = action.payload,
    );
    await stateManager.dispatch(action1());
    assertEquals(stateManager.getState().value, test1);

    await stateManager.dispatch(action2(test2));
    assertEquals(stateManager.getState().value, test2);

    await action3(test3);
    assertEquals(stateManager.getState().value, test3);
  });

  await tst.step("view", async () => {
    const v1 = stateManager.createView("v1", { title: "" }, (action, state) => {
      if (action1.is(action)) {
        return { title: test4 };
      }
      if (action2.is(action)) {
        return { title: action.payload };
      }
      return { title: state.value };
    });

    await stateManager.dispatch(action1());
    assertEquals(v1.getModel().title, test4);

    await stateManager.dispatch(action2(test5));
    assertEquals(v1.getModel().title, test5);
  });

  await tst.step("effect", async () => {
    const action = action2(test6);
    await stateManager.dispatch(action);
    assertEquals(effectQueue.pop(), action);
  });

  await tst.step("subscrubers", async () => {
    const action = action2(test7);
    await stateManager.dispatch(action);
    assertEquals(subscriberQueue.pop(), action);
  });
});
