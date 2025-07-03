import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "tcg",
  host: "localhost",
  database: "Permalist",
  password: "tcg",
  port: 5432,
});
db.connect();

async function getItems(){
  const response = await db.query("SELECT * FROM items");
  return response.rows;
}

async function addItem(item){
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)",
      [item]
    );
    
  } catch (error) {
    console.log(error);
  }
}
 
app.get("/", async (req, res) => {
  const result = await getItems();
  console.log(result);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await addItem(item)
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
