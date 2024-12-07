import { createApp, upload } from "./config.js";
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
  res.render("user", { user: { username: req.session.username } });
});

app.post("/user", async function (req, res) {
  const result = await app.locals.pool.query(
    "SELECT * FROM users WHERE id = $1",
    [req.session.userid]
  );
  if (bcrypt.compareSync(req.body.oldPassword, result.rows[0].password)) {
    console.log("MATCHED, changing password...");
    var password = bcrypt.hashSync(req.body.newPassword, 10);
    app.locals.pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [password, req.session.userid],
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
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});
/* start=1, end=5 */
app.post("/create_post", upload.single("image"), async function (req, res) {
  console.log(req.file, req.files);
  await app.locals.pool.query(
    "INSERT INTO posts (title, description, user_id, image, category) VALUES ($1, $2, $3, $4, $5)",
    [
      req.body.title,
      req.body.content,
      req.session.userid,
      req.file.filename,
      "",
    ]
  );
  res.redirect("/feed");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
