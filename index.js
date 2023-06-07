const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Routes/user.routes");
const { notesRouter } = require("./Routes/note.routes");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port;

const app = express();

cors;

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("DB Connected.");
    console.log(`Server running at port ${PORT}`);
  } catch (error) {
    console.log(`DB Error: ${error}`);
  }
});
