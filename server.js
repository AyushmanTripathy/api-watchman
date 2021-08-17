const app = require("express")();
const PORT = process.env.PORT || 8080;

app.listen(PORT, startedServer);

app.get("/get/:id", handleGetReq);

async function handleGetReq(req, res) {
  const { id } = req.params;
  res.send(id);
}

function startedServer() {
  console.log(`started server ${PORT}`);
}
