import express from "express";
import cors from "cors";
import multer from "multer";
import { upload } from "./middleware/multer-config";

// get data from database with drizzle
import { db } from "./db/db";
import { themes, themeItems } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/image", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/themes", async (req: express.Request, res: express.Response) => {
  const results = await db.query.themes.findMany();
  res.json(results);
});

app.get(
  "/api/themes/:id",
  async (req: express.Request, res: express.Response) => {
    const results = await db.query.themes.findFirst({
      where: eq(themes.id, parseInt(req.params.id)),
      with: {
        themeItems: true,
      },
    });
    // for image property, add the full path
    results!.themeItems.forEach((item: any) => {
      item.image = `http://localhost/image/${item.image}`;
    });

    res.json(results);
  },
);

app.put(
  "/api/themes/:id",
  async (req: express.Request, res: express.Response) => {
    const id: number = parseInt(req.params.id);
    const name: string = req.body.name;
    var maxRanking: number = parseInt(req.body.max_ranking);

    // Si maxRanking dépasse le nombre d'items et ne dépasse pas 10, on le met à la valeur d'items
    const items = await db.query.themeItems.findMany({
      where: eq(themeItems.themeId, id),
    });

    if (maxRanking > items.length) {
      maxRanking = items.length;
    } else if (maxRanking > 10) {
      maxRanking = 10;
    }

    const results = await db
      .update(themes)
      .set({ name: name, maxRanking: maxRanking })
      .where(eq(themes.id, id));

    res.json(results);
  },
);

app.post(
  "/api/theme-items",
  upload.single("image"),
  async (req: express.Request, res: express.Response) => {
    const themeId: number = parseInt(req.body.themeId);
    const name: string = req.body.name;

    if (!req.file) {
      const results = await db.insert(themeItems).values({
        themeId: themeId,
        name: name,
      });
      return res.json(results);
    }

    const image: string = req.file!.filename;
    const results = await db.insert(themeItems).values({
      themeId: themeId,
      name: name,
      image: image,
    });
    res.json(results);
  },
);

app.put(
  "/api/theme-items/:id",
  upload.single("image"),
  async (req: express.Request, res: express.Response) => {
    const id: number = parseInt(req.params.id);
    const name: string = req.body.name;

    if (!req.file) {
      const results = await db
        .update(themeItems)
        .set({ name: name })
        .where(eq(themeItems.id, id));
      return res.json(results);
    }

    const image: string = req.file!.filename;
    const results = await db
      .update(themeItems)
      .set({ name: name, image: image })
      .where(eq(themeItems.id, id));

    res.json(results);
  },
);

app.delete(
  "/api/theme-items/:id",
  async (req: express.Request, res: express.Response) => {
    const id: number = parseInt(req.params.id);
    const results = await db.delete(themeItems).where(eq(themeItems.id, id));
    res.json(results);
  },
);

app.listen(80, () => {
  console.log("Server is running on port 80");
});
