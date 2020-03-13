import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.set("json spaces", 2);
app.use(bodyParser.json());
app.use(express.static("public"));

// SERVER SECRETS
const SERVER_SECRET_KEY = "SERVER_SECRET_KEY";
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSOWRD = "password";

const authentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")?.pop();
  if (!token) res.sendStatus(401);

  req.token = token;
  return next();
};

app.get("/", (req, res) => res.json({ message: "Hello, stranger!" }));

app.get("/admin", authentication, (req, res) =>
  jwt.verify(req.token, SERVER_SECRET_KEY, err =>
    err
      ? res.sendStatus(401)
      : res.json({
          data: {
            user_infomation: {
              gtNE336b4f9zNYy4: {
                email: "foo@foo.com",
                passowrd: "Rz6tvPwaFZQCDVFB"
              },
              nvh88tpNJQXNHTR5: {
                email: "bar@bar.com",
                passowrd: "Rz6tvPwaFZQCDVFB"
              }
            }
          }
        })
  )
);

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSOWRD) {
    return res.sendStatus(401);
  }

  return jwt.sign(
    { email, password },
    SERVER_SECRET_KEY,
    { expiresIn: "60s" },
    (_err, token) => res.json({ message: "sign in success", token })
  );
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`go http://localhost:${port}`));
