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

//建立連線
const { MongoClient, ServerApiVersion, Collection, Db } = require('mongodb');
const uri = "mongodb+srv://root:root123@mycluster.3ybb1cw.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    db = client.db("mywebsite");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}


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

//註冊會員的路由
app.post("/signup", async function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);

  // 檢查資料庫的資料
  // let collection = global.db.collection("user");
  //const collection1 = db.collection("user");
  let collection = db.collection("user");
  let result = await collection.findOne({ email: email });
  if (result !== null) {
    return res.redirect("/error?msg=註冊失敗，信箱重複");
  }

  // 如果信箱不重複，則將新會員資料插入資料庫
  result = await collection.insertOne({ name: name, email: email, password: password });
  res.redirect("/");
});


// 啟動伺服器在 http://localhost:3000
// app.listen(3000, function () {
//   console.log("Server Started");
// });
run().then(() => {
  app.listen(3000, function () {
    console.log("Server Started");
  });
}).catch(console.dir);
