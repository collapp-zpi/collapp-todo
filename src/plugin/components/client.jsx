import React from "react";
import { FiCheck, FiPlus, FiTrash } from "react-icons/fi";
import classNames from "classnames";
import styled from "styled-components";
import { useWebsockets } from "../../core/useWebsockets";

const StyledContainer = styled.div`
  background-size: 2rem 2rem;
  background-position: -1em -1em;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
`

function Plugin({ websockets, ids }) {
  const { state, send } =
    useWebsockets(`${websockets}/?id=${ids?.space}_${ids?.plugin}`);

  const todos = state?.todos ?? []

  const handleUpdate = (i) => (data) => {
    send("change", { i, ...data })
  }

  const handleDelete = (i) => () => {
    send("remove", i)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let value = e?.target?.todo?.value
    if (!value) return
    value = String(value).trim()
    if (!value) return

    send("create", { value })
    e.target.todo.value = ''
  }

  const handleClick = (i) => () => {
    handleUpdate(i)({ isDone: !todos[i].isDone })
  }

  const handleChange = (i) => (e) => {
    const value = e?.target?.value
    if (!value) return

    handleUpdate(i)({ value })
  }

  return (
    <StyledContainer className="w-full h-full bg-gray-100 p-8 overflow-y-auto space-y-0.5 text-gray-500">
      {todos.map(({ isDone, value }, i) => (
        <div className="flex select-none">
          <div className="flex cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-5 transition-colors rounded-xl py-4 px-2" onClick={handleClick(i)}>
            <div className={classNames(`w-6 h-6 rounded-md border-blue-500 border-2 flex-shrink-0 relative overflow-hidden text-blue-500 transition-colors`, isDone && 'bg-blue-500')}>
              <FiCheck className={classNames("text-white absolute left-1/2 top-1/2 transition-transform -translate-y-1/2 -translate-x-1/2", isDone ? 'scale-100' : 'scale-0')} strokeWidth={3} />
            </div>
          </div>
          <input className="py-4 px-2 flex-grow bg-transparent outline-none" value={value} onChange={handleChange(i)} />
          <div className="flex group items-center cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-5 transition-colors rounded-xl p-2 ml-1" onClick={handleDelete(i)}>
            <div className="flex items-center justify-center font-bold flex-shrink-0 opacity-20 text-red-500 group-hover:opacity-100 transition-opacity">
              <FiTrash />
            </div>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label className="flex items-center relative">
          <div className="w-6 h-6 my-4 mx-2">
            <FiPlus className="text-2xl" strokeWidth={3} />
          </div>
          <input className="py-4 px-2 flex-grow bg-transparent outline-none" name="todo" placeholder="New task" />
        </label>
      </form>
    </StyledContainer>
  );
}

export default Plugin;
