import helmet from "helmet";
import express, { ErrorRequestHandler, text } from "express";
import morgan from "morgan";
import { getTodos, createTodos, deleteTodo, updateTodo } from "./db";

const DB_LATENCY = 500; // ms
const APP_PORT = 4000;

const app = express();
const scriptSources = ["'self'", "https://unpkg.com"];
const styleSources = ["'self'", "'unsafe-inline'"];
const connectSources = ["'self'"];
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: scriptSources,
        scriptSrcElem: scriptSources,
        styleSrc: styleSources,
        connectSrc: connectSources,
      },
      reportOnly: true,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Simulate latency
app.use(function (req, res, next) {
  setTimeout(next, DB_LATENCY);
});

app.get("/todo", async (req, res, next) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// Insert
app.put("/todo", async (req, res, next) => {
  try {
    const todoText = req.body?.todoText ?? "";
    if (!todoText) throw new Error("Empty todoText");
    await createTodos(todoText);
    const todos = await getTodos();
    res.json({ msg: `Insert successfully`, data: todos[-1] });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", async (req, res, next) => {
  try {
    const id = req.body?.curId ?? "";
    console.log({ id });
    await deleteTodo(id);
    res.json({
      msg: `Delete successfully`,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

// Update
app.patch("/todo", async (req, res, next) => {
  try {
    const id = req.body?.curId ?? "";
    const todoTextUpdated = req.body?.todoText ?? "";
    await updateTodo(id, todoTextUpdated);
    const todos = await getTodos();
    res.json({ msg: `Update successfully`, data: null });
  } catch (err) {
    next(err);
  }
});

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let serializedError = JSON.stringify(err, Object.getOwnPropertyNames(err));
  serializedError = serializedError.replace(/\/+/g, "/");
  serializedError = serializedError.replace(/\\+/g, "/");
  res.status(500).send({ error: serializedError });
};
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
