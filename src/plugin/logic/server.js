const create = (state, data) => {
  const todos = state?.todos ?? []
  return {
    ...state,
    todos: [
      ...todos,
      {
        isDone: false,
        ...data,
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

const reorder = (state, { from, to }) => {
  const todos = state?.todos ?? []
  const [item] = todos.splice(from, 1)
  todos.splice(to, 0, item)

  return {
    ...state,
    todos,
  }
}

const open = (state) => {
  return state;
};

const events = {
  create,
  change,
  remove,
  reorder,
  __OPEN: open,
};

module.exports = {
  default: events,
};
