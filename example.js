const cors = require("cors");
const app = require("express")();
const PORT = process.env.PORT || 8080;

app.listen(PORT, startedServer);
//op
app.get("/get/:id", handleGetReq);
app.post("/post/:id", handlePostReq);

function handleGetReq(req, res) {
  const { id } = req.params;
  console.log("req from " + id);
  res.send(JSON.stringify({ id }));
}

function handlePostReq(req, res) {
  const { id } = req.params;
  console.log("post ");
  res.send(JSON.stringify({ id }));
}

function startedServer() {
  console.log(`started server ${PORT}`);
}
