import React, { useEffect, useState } from "react";
import { FiCheck, FiPlus, FiTrash } from "react-icons/fi";
import classNames from "classnames";
import styled from "styled-components";
import { DebouncedInput } from "./DebouncedInput";
import { MdDragIndicator } from "react-icons/md";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { events } from "../logic/server"

const StyledContainer = styled.div`
  background-size: 1.5rem 1.5rem;
  background-position: -0.75em -0.75em;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.02) 2px, transparent 2px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 2px, transparent 2px);
`

function Plugin({ useWebsockets }) {
  const { state, send } = useWebsockets();
  const [todos, setTodos] = useState([])

  useEffect(() => {
    setTodos(state?.todos ?? [])
  }, [state?.todos])

  const handleUpdate = (i) => (data) => {
    send("change", { i, ...data })
    setTodos(events.change(state, { i, ...data }).todos)
  }

  const handleDelete = (i) => () => {
    send("remove", i)
    setTodos(events.remove(state, i).todos)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let value = e?.target?.todo?.value
    if (!value) return
    value = String(value).trim()
    if (!value) return

    const data = {
      value,
      date: String(new Date().getTime()),
    }

    send("create", data)
    setTodos(events.create(state, data).todos)
    e.target.todo.value = ''
  }

  const handleClick = (i) => () => {
    handleUpdate(i)({ isDone: !todos[i].isDone })
  }

  const handleDrop = ({ destination, source }) => {
    if (!source || !destination) return
    if (source.index === destination.index) return

    send("reorder", {
      from: source.index,
      to: destination.index,
    })
    setTodos(events.reorder(state, {
      from: source.index,
      to: destination.index,
    }).todos)
  }

  return (
    <StyledContainer className="w-full h-full bg-gray-100 py-8 overflow-y-auto space-y-0.5 text-gray-500" style={{ fontFamily: 'Poppins' }}>
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="todos">
          {({ droppableProps, innerRef, placeholder }) => (
            <div className="space-y-0.5" {...droppableProps} ref={innerRef}>
              {todos.map(({ isDone, value, date }, i) => (
                <Draggable draggableId={date} index={i} key={date}>
                  {({ innerRef, draggableProps, dragHandleProps }) => (
                    <div className="flex select-none pr-8 relative group" {...draggableProps} ref={innerRef}>
                      <div className="w-8 flex items-center justify-center transition-opacity group-hover:opacity-100 opacity-0" {...dragHandleProps}>
                        <MdDragIndicator className="ml-2 text-gray-500 text-xl" />
                      </div>
                      <div className="flex items-center cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-5 transition-colors rounded-xl py-3 px-2" onClick={handleClick(i)}>
                        <div className={classNames(`w-5 h-5 rounded-md border-blue-500 border-2 flex-shrink-0 relative overflow-hidden text-blue-500 transition-colors`, isDone && 'bg-blue-500')}>
                          <FiCheck className={classNames("text-white absolute left-1/2 top-1/2 transition-transform -translate-y-1/2 -translate-x-1/2", isDone ? 'scale-100' : 'scale-0')} strokeWidth={4} />
                        </div>
                      </div>
                      <DebouncedInput {...{ value, isDone }} handleUpdate={handleUpdate(i)} />
                      <div className="flex items-center cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-5 opacity-20 hover:opacity-100 hover:text-red-500 transition-all rounded-xl p-2 ml-1" onClick={handleDelete(i)}>
                        <div className="flex items-center justify-center font-bold flex-shrink-0">
                          <FiTrash />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <form onSubmit={handleSubmit} className="px-8">
        <label className="flex items-center relative">
          <div className="w-5 h-5 my-4 mx-2">
            <FiPlus className="text-xl" strokeWidth={3} />
          </div>
          <input className="py-3 px-2 flex-grow bg-transparent outline-none" name="todo" placeholder="New task" />
        </label>
      </form>
    </StyledContainer>
  );
}

export default Plugin;

