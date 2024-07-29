import { FC, useState } from "react";
import axios from "axios";
import useStore from "../utils/store";
interface Props {
  fetchData: () => void;
}

export const FormInput: FC<Props> = ({ fetchData }) => {
  const [message, setMessage] = useState("");
  const [
    mode,
    setMode,
    inputText,
    setInputText,
    curId,
    setCurId,
    pending,
    setPending,
  ] = useStore((state) => [
    state.mode,
    state.setMode,
    state.inputText,
    state.setInputText,
    state.curId,
    state.setCurId,
    state.pending,
    state.setPending,
  ]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleSubmit() {
    if (!inputText) {
      setMessage("Empty Text");
      return;
    }
    setPending(true);
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: { todoText: inputText },
        })
        .then(fetchData)
        .then(() => {
          setInputText("");
          setMessage("");
        })
        .catch((err) => alert(err))
        .finally(() => setPending(false));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { curId, todoText: inputText },
        })
        .then(fetchData)
        .then(() => {
          setInputText("");
          setMessage("");
          setMode("ADD");
          setCurId("");
        })
        .catch((err) => alert(err))
        .finally(() => setPending(false));
    }
  }

  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurId("");
  }

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateColumns: mode === "ADD" ? "4fr 1fr" : "4fr 1fr 1fr",
          alignItems: "start",
        }}
      >
        <input
          type="text"
          onChange={handleChange}
          value={inputText}
          disabled={pending}
        />
        <button onClick={handleSubmit} disabled={pending}>
          {mode === "ADD" ? "Submit" : "Update"}
        </button>
        {mode === "EDIT" && (
          <button
            onClick={handleCancel}
            className="contrast"
            disabled={pending}
          >
            Cancel
          </button>
        )}
      </div>
      {<i className="pico-color-red-300">{message ?? ""}</i>}
    </>
  );
};
