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

async function upateItem(item_id, title){
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2;",
      [title, item_id]
    );
    
  } catch (error) {
    console.log(error);
  }
}

async function deleteItem(item_id){
  try {
    await db.query("DELETE FROM items WHERE id = $1;",
    [item_id]
  );
  } catch (error) {
    console.log(error);
  }
}
 
app.get("/", async (req, res) => {
  const result = await getItems();
  // console.log(result);
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

app.post("/edit", async (req, res) => {
  const item_id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  await upateItem(item_id, title);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const item_id = req.body.deleteItemId;
  await deleteItem(item_id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
