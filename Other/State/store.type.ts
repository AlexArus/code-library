export type Action<Type extends string | unknown, Payload = undefined> =
  Payload extends undefined ? {
      id: symbol;
      type: Type;
    }
    : {
      id: symbol;
      type: Type;
      payload: Payload;
    };

export type ActionAny = Action<any, any>;

export type ActionCreator<Type extends string | unknown, Payload = undefined> =
  Payload extends undefined ? () => Action<Type, Payload>
    : (payload: Payload) => Action<Type, Payload>;

export type ActionGuard<Type extends string | unknown, Payload = undefined> = (
  action: ActionAny,
) => action is Action<Type, Payload>;

export type ActionInstance<Type extends string | unknown, Payload = undefined> =
  Payload extends undefined ? {
      (): Action<Type, Payload>;
      is: ActionGuard<Type, Payload>;
    }
    : {
      (payload: Payload): Action<Type, Payload>;
      is: ActionGuard<Type, Payload>;
    };
