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

const change = (state, { i, ...data }) => {
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
  change,
  remove,
  __OPEN: open,
};

module.exports = {
  default: events,
};
