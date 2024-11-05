import { createApp } from "./config.js";

const app = createApp({
  user: "wandering_water_3730",
  host: "bbz.cloud",
  database: "wandering_water_3730",
  password: "4cc7ed3614d24ef81c834e37c374892d",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("SELECT * FROM posts");
  res.render("start", { posts: posts.rows });
});

app.get("/post/:id", async function (req, res) {
  const posts = await app.locals.pool.query(
    `select * from posts WHERE id = ${req.params.id}`
  );
  res.render("post", { posts: posts.rows });
});

app.get("/user", async function (req, res) {
  const posts = await app.locals.pool.query(
    "SELECT * FROM posts WHERE user_id = $1",
    [req.session.userid]
  );
  res.render("user", { posts: posts.rows });
});

app.get("/new_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

app.post("/create_post", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)"[
      (req.body.title, req.body.content, req.session.userid)
    ]
  );
  res.direct("/feed");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
