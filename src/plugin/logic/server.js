const actions = (todos = []) => ({
  create: (data) => [
    ...todos,
    {
      isDone: false,
      ...data,
    }
  ],
  change: (i, data) => [
    ...todos.slice(0, i),
    {
      ...todos[i],
      ...data,
    },
    ...todos.slice(i + 1),
  ],
  remove: (i) => [
    ...todos.slice(0, i),
    ...todos.slice(i + 1),
  ],
  reorder: (from, to) => {
    const newTodos = [...todos]
    const [item] = newTodos.splice(from, 1)
    newTodos.splice(to, 0, item)
    return newTodos
  }
})

const create = (state, data) =>
  actions(state?.todos).create(data);

const change = (state, { i, ...data }) =>
  actions(state?.todos).change(i, data);

const remove = (state, i) =>
  actions(state?.todos).remove(i);

const reorder = (state, { from, to }) =>
  actions(state?.todos).reorder(from, to);

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
  actions,
};
