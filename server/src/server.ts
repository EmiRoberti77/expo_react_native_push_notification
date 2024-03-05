import express, { Response, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
dotenv.config();
const pushEndPoint = process.env.PUSH_ENDPOINT!;
const reciptsEndPoint = process.env.RECEIPTS_ENDPOINT!;
const to = process.env.PUSH_TO_TOKEN!;
const port = 5001;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/push", async (req: Request, res: Response) => {
  const { title, body } = req.body;
  const response = await axios.post(pushEndPoint, {
    to,
    title,
    body,
  });
  res.json({
    message: true,
    body: response.data,
  });
});

app.post("/receipts", async (req: Request, res: Response) => {
  const { ids } = req.body;
  const response = await axios.post(reciptsEndPoint, { ids });
  console.log(ids);
  res.json({
    message: true,
    body: response.data,
  });
});

app.listen(port, () => {
  console.log("started", port, new Date().toISOString());
});
