const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const weeksRoutes = require("./routes/weeks.js");
const lessonsRoutes = require("./routes/lessons.js");
const groupRoutes = require("./routes/groups.js");
const divisionsRoutes = require("./routes/divisions.js");
const teachersRoutes = require("./routes/teachers.js");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/schedule/", weeksRoutes);
app.use("/schedule/", lessonsRoutes);
app.use("/schedule/", groupRoutes);
app.use("/schedule/", divisionsRoutes);
app.use("/schedule/", teachersRoutes);

const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/schedule", {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log(e);
  }
};

connectToDb().then((r) => {
  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Server is start on port ${port}`);
});
