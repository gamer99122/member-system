//建立網站伺服器基礎設定
const express = require('express');
const app = express();
const session = require("express-session");
app.use(session({
  secret: "anything",
  resave: false,
  saveUninitialized: true
}));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));//管理靜態檔案
app.use(express.urlencoded({ extended: true }));//接受前端post的
//需要處理的路由
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/member", function (req, res) {
  res.render("member.ejs");
});

//連線到 /error?msg=錯誤訊息
app.get("/error", function (req, res) {
  const msg = req.query.msg;
  res.render("error.ejs", { msg: msg });
});

// 啟動伺服器在 http://localhost:3000
app.listen(3000, function () {
  console.log("Server Started");
});

//建立連線
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:password@mycluster.3ybb1cw.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
