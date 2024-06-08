import { DeepReadonly } from "../Types/deep-readonly.ts";
import { ActionAny, Action, ActionInstance } from './stateManager.type.ts';

/**
 * Simple action factory
 * @param type {string} - action type
 * @returns 
 */
export const createAction = <Type extends string, Payload = undefined>(
  type: Type,
) => {
  const id = Symbol(type);
  const actionInstance = (payload: Payload) =>
    payload ? { id, type, payload } : { id, type };
  actionInstance.is = (
    action: ActionAny,
  ): action is Action<Type, Payload> => {
    return action.id === id;
  };

  return actionInstance as ActionInstance<Type, Payload>;
};

export const createStateManager = <State>(
  state: State,
  rootReducer?: (action: ActionAny, state: State) => void,
  rootEffect?: (
    action: ActionAny,
    state: DeepReadonly<State>,
  ) => Promise<void>,
) => {
  type Subscriber = (
    action: ActionAny,
    state: DeepReadonly<State>,
  ) => void;
  const subscribers = new Array<Subscriber>();

  const viewUpdaters = new Array<
    (action: ActionAny, state: DeepReadonly<State>) => void
  >();

  const stateManager = {
    getState: () => state as DeepReadonly<State>,

    createAction: <Type extends string, Payload = undefined>(
      type: Type,
      reducer?: (action: Action<Type, Payload>, state: State) => void,
      effect?: (
        action: Action<Type, Payload>,
        state: DeepReadonly<State>,
      ) => Promise<void>,
    ) => {
      const id = Symbol(type);
      const actionInstance = async (payload: Payload) => {
        const action =
          (typeof payload === "undefined"
            ? { id, type }
            : { id, type, payload }) as Action<Type, Payload>;

        reducer?.(action, state);
        rootReducer?.(action, state);

        effect?.(action, state as DeepReadonly<State>);
        await rootEffect?.(action, state as DeepReadonly<State>);

        subscribers.forEach((subscriber) =>
          subscriber(action, state as DeepReadonly<State>)
        );
        viewUpdaters.forEach((item) =>
          item(action, state as DeepReadonly<State>)
        );

        return action;
      };
      actionInstance.is = (
        action: ActionAny,
      ): action is Action<Type, Payload> => action.id === id;

      return actionInstance;
    },

    dispatch: async (action: ActionAny) => {
      rootReducer?.(action, state);
      await rootEffect?.(action, state as DeepReadonly<State>);
      subscribers.forEach((subscriber) =>
        subscriber(action, state as DeepReadonly<State>)
      );
      viewUpdaters.forEach((item) =>
        item(action, state as DeepReadonly<State>)
      );
    },

    subscribe: (
      subscriber: (
        action: ActionAny,
        state: DeepReadonly<State>,
      ) => void,
    ) => {
      subscribers.push(subscriber);
      return () =>
        subscribers.splice(
          subscribers.findIndex((item) => item === subscriber),
          1,
        );
    },

    createView: <Name extends string, Model>(
      name: Name,
      model: Model,
      update: (
        action: ActionAny,
        state: DeepReadonly<State>,
      ) => Model,
    ) => {
      const subscribers = new Array<(model: Model) => void>();
      const viewUpdater = (
        action: ActionAny,
        state: DeepReadonly<State>,
      ) => {
        model = update(action, state);
        subscribers.forEach((item) => item(model));
      };
      const view = {
        getName: () => name,
        getModel: () => model as DeepReadonly<Model>,
        subscribe: (subscriber: (model: Model) => void) =>
          subscribers.push(subscriber),
        dispose: () =>
          viewUpdaters.splice(
            viewUpdaters.findIndex((item) => item === viewUpdater),
            1,
          ),
      };
      viewUpdaters.push(viewUpdater);
      return view;
    },
  };

  return stateManager;
};
