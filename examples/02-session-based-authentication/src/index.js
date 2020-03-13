import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("json spaces", 2);
app.use(bodyParser.json());
app.use(express.static("public"));

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSOWRD = "password";

const SESSION_IDS = {};

const authentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")?.pop();
  return token && SESSION_IDS[token] ? next() : res.sendStatus(401);
};

app.get("/", (req, res) => res.json({ message: "Hello, stranger!" }));

app.get("/admin", authentication, (req, res) =>
  res.json({
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
);

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!(email === ADMIN_EMAIL && password === ADMIN_PASSOWRD)) {
    return res.status(403).json({ error: "not admin" });
  }

  const sessionId = Buffer.from(
    JSON.stringify({ email, iat: new Date() })
  ).toString("base64"); // eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6IjIwMjAtMDMtMTJUMDU6NTc6MTkuMjgzWiJ9
  
  SESSION_IDS[sessionId] = true;

  return res.json({
    message: "Sign in successful",
    token: sessionId
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`go http://localhost:${port}`));
