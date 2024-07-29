import { FC } from "react";
import axios from "axios";
import useStore, { TodoType } from "../utils/store";

interface Props {
  fetchData: () => void;
  todos: TodoType[];
}
export const TodoList: FC<Props> = ({ fetchData, todos }) => {
  const [curId] = useStore((state) => [state.curId]);

  return (
    <div data-cy="todo-item-wrapper">
      {todos.map((todo, idx) => {
        const fontStyle = todo.id === curId ? "700" : "400";
        const fontClass = todo.id === curId ? "pico-color-blue-400" : "";
        return (
          <article
            key={todo.id}
            className="grid"
            style={{
              alignItems: "center",
              gridTemplateColumns: "0.5fr 4fr 1fr 1fr",
            }}
          >
            <span>({idx + 1})</span>
            <span style={{ fontWeight: fontStyle }} className={fontClass}>
              ✍️ {todo.todoText}
            </span>
            <ButtonGroup fetchData={fetchData} todo={todo} />
          </article>
        );
      })}
    </div>
  );
};

interface PropsButtonGroup {
  fetchData: () => void;
  todo: TodoType;
}
const ButtonGroup: FC<PropsButtonGroup> = ({ todo, fetchData }) => {
  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { curId: id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err));
  }

  const [mode, setMode, setInputText, setCurId] = useStore((state) => [
    state.mode,
    state.setMode,
    state.setInputText,
    state.setCurId,
  ]);

  if (mode === "EDIT") return <></>;

  return (
    <>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setMode("EDIT");
          setCurId(todo.id);
          setInputText(todo.todoText);
        }}
      >
        🖊️
      </div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleDelete(todo.id)}
        data-cy="todo-item-delete"
      >
        🗑️
      </div>
    </>
  );
};
