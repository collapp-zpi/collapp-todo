const create = (state, { value }) => {
  const todos = state?.todos ?? []
  return {
    ...state,
    todos: [
      ...todos,
      {
        isDone: false,
        value,
      },
    ],
  };
};

const update = (state, { i, ...data }) => {
  const todos = state?.todos ?? []
  return {
    ...state,
    todos: [
      ...todos.slice(0, i),
      {
        ...todos[i],
        ...data,
      },
      ...todos.slice(i + 1),
    ],
  };
};

const remove = (state, i) => {
  const todos = state?.todos ?? []
  return {
    ...state,
    todos: [
      ...todos.slice(0, i),
      ...todos.slice(i + 1),
    ],
  };
};

const open = (state) => {
  return state;
};

const events = {
  create,
  update,
  remove,
  __OPEN: open,
};

export default events;
