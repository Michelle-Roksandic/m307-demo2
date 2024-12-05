import { createApp } from "./config.js";
import bcrypt from "bcrypt";
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

app.get("/feed", async function (req, res) {
  const posts = await app.locals.pool.query("SELECT * FROM posts");
  res.render("feed", { posts: posts.rows });
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
  //TODO: set username from session once setting on session works
  console.log(req.session.userid, req.session.username);
  res.render("user", { user: { username: "testuser" } });
});

app.post("/user", async function (req, res) {
  const result = await app.locals.pool.query(
    "SELECT * FROM users WHERE id = $1",
    [4]
  );
  if (bcrypt.compareSync(req.body.oldPassword, result.rows[0].password)) {
    console.log("MATCHED, changing password...");
    var password = bcrypt.hashSync(req.body.newPassword, 10);
    //TODO: Change id 4 to logged in userid, once req.session.userid works
    app.locals.pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [password, 4],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log("SUCCESSFULLY changed password");
        res.redirect("/login");
      }
    );
  } else {
    res.redirect("/user");
  }
});

app.get("/new_post", async function (req, res) {
  //TODO: comment this code in, once req.session.userid works
  // if (!req.session.userid) {
  //   res.redirect("/login");
  //   return;
  // }
  res.render("new_post", {});
});

app.post("/create_post", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (title, description, user_id, image, category) VALUES ($1, $2, $3, $4, $5)",
    [req.body.title, req.body.content, 4, "", ""]
  );
  res.redirect("/");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
