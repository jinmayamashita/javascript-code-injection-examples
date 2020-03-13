import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.set("json spaces", 2);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSOWRD = "password";

const SESSION_IDS = {};

const authentication = (req, res, next) =>
  req?.cookies?.token && SESSION_IDS[req?.cookies?.token]
    ? next()
    : res.sendStatus(401);

app.get("/", (req, res) => res.json({ message: "Hello, stranger!" }));

app.get("/admin", authentication, (_, response) =>
  response.json({
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

app.post("/signin", (request, response) => {
  const { email, password } = request.body;

  if (!(email === ADMIN_EMAIL && password === ADMIN_PASSOWRD)) {
    return response.status(403).json({ error: "not admin" });
  }

  const sessionId = Buffer.from(
    JSON.stringify({ email, iat: new Date() })
  ).toString("base64"); // eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6IjIwMjAtMDMtMTJUMDU6NTc6MTkuMjgzWiJ9

  SESSION_IDS[sessionId] = true;

  // no Secure for local test
  response.cookie("token", sessionId, {
    maxAge: 30000,
    // httpOnly: true // preventing access to cookie
  });
  return response.json({ message: "Sign in successful" });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`go http://localhost:${port}`));
