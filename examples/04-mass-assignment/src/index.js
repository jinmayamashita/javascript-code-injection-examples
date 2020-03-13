import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.set("json spaces", 2);
app.use(bodyParser.json());
app.use(express.static("public"));

// SERVER SECRETS
const { SERVER_SECRET_KEY } = process.env;

// database handles
const conn = mongoose.createConnection(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

const User = conn.model("user", UserSchema);

const registerUser = async payload => {
  const exists = await User.exists({ email: payload.email });
  return !exists ? new User(payload).save() : null;
};

const getUser = async payload => User.findOne(payload);
const getUsers = async () => User.find();

// auth middleware
const authentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")?.pop();
  if (!token) return res.sendStatus(403);

  req.token = token;
  return next();
};

// apis
app.post("/api/register", async ({ body }, res) => {
  const success = await registerUser(body);
  if (!success) return res.status(403).json({ error: "Forbidden" });

  return res.json(success);
});

app.post("/api/signin", async ({ body }, res) => {
  const user = await getUser(body);
  if (!user) return res.status(403).json({ error: "Forbidden" });

  const keys = user.toObject();
  delete keys.password;
  return jwt.sign(
    keys,
    SERVER_SECRET_KEY,
    // https://github.com/zeit/ms#examples
    { expiresIn: "10s" },
    (err, token) => {
      res.json({ message: "sign in success", token });
    }
  );
});

app.get("/api/admin", authentication, (req, res) => {
  return jwt.verify(req.token, SERVER_SECRET_KEY, async (err, authed) => {
    if (err || authed.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const users = await getUsers();
    return res.json(users);
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`go http://localhost:${port}`));
