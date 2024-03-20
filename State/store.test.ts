import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";

import { ActionAny, createAction, createStore } from "./store.ts";

const test1 = "test1";
const test2 = "test2";
const test3 = "test3";
const test4 = "test4";
const test5 = "test5";
const test6 = "test6";
const test7 = "test7";

Deno.test("Store", async (tst) => {
  const effectQueue: Array<ActionAny> = [];
  const subscriberQueue: Array<ActionAny> = [];

  const action1 = createAction("action1");
  const action2 = createAction<"action2", string>("action2");

  const store = createStore(
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
  store.subscribe((action, state) => {
    subscriberQueue.push(action);
  });

  await tst.step("actions", async () => {
    const action3 = store.addAction<"action3", string>(
      "action3",
      (action, state) => state.value = action.payload,
    );
    await store.dispatch(action1());
    assertEquals(store.getState().value, test1);

    await store.dispatch(action2(test2));
    assertEquals(store.getState().value, test2);

    await action3(test3);
    assertEquals(store.getState().value, test3);
  });

  await tst.step("view", async () => {
    const v1 = store.addView("v1", { title: "" }, (action, state) => {
      if (action1.is(action)) {
        return { title: test4 };
      }
      if (action2.is(action)) {
        return { title: action.payload };
      }
      return { title: state.value };
    });

    await store.dispatch(action1());
    assertEquals(v1.getModel().title, test4);

    await store.dispatch(action2(test5));
    assertEquals(v1.getModel().title, test5);
  });

  await tst.step("effect", async () => {
    const action = action2(test6);
    await store.dispatch(action);
    assertEquals(effectQueue.pop(), action);
  });

  await tst.step("subscrubers", async () => {
    const action = action2(test7);
    await store.dispatch(action);
    assertEquals(subscriberQueue.pop(), action);
  });
});
