import express from "express";
import cors from "cors";

// get data from database with drizzle
import { db } from "./db/db";
import { themes, themeItems } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();

app.use(cors());
app.use("/image", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/themes", async (req: express.Request, res: express.Response) => {
    const results = await db.query.themes.findMany();
    res.json(results);
});

app.get("/api/themes/:id", async (req: express.Request, res: express.Response) => {
    const results = await db.query.themes.findFirst({
        where: eq(themes.id, parseInt(req.params.id)),
        with: {
            themeItems: true
        }
    });
    res.json(results);
});

// app.get("/api/theme/:id/items", async (req: express.Request, res: express.Response) => {
//     const results = await db.query.themeItemTable.findMany({
//         where: eq(themeItemTable.themeId, req.params.id)
//     });
//     res.json(results);
// });

app.listen(80, () => {
  console.log("Server is running on port 80");
});
