import { Request, Response } from "express";

// Get data from database with drizzle
import { db } from "db/db";
import { themes, themeItems } from "db/schema";
import { eq } from "drizzle-orm";

// Add a new theme item to a theme in the database
export const addThemeItem = async (req: Request, res: Response) => {

    // Get the theme item properties from the request
    const themeId: number = parseInt(req.body.theme_id);
    const name: string = req.body.name;

    // If there is no image, insert the theme item without
    if (!req.file) {
        const results = await db.insert(themeItems).values({
            themeId: themeId,
            name: name,
        });
        return res.json(results);
    }

    // Otherwise, insert the theme item with the image
    const image: string = req.file!.filename;
    const results = await db.insert(themeItems).values({
        themeId: themeId,
        name: name,
        image: image,
    });

    res.json(results);
};

// Update a theme item in the database
export const updateThemeItem = async (req: Request, res: Response) => {

    // Get the theme item properties from the request
    const id: number = parseInt(req.params.id);
    const name: string = req.body.name;

    // If there is no image, update the theme item without
    if (!req.file) {
        const results = await db
            .update(themeItems)
            .set({ name: name })
            .where(eq(themeItems.id, id));
        return res.json(results);
    }

    // Otherwise, update the theme item with the image
    const image: string = req.file!.filename;
    const results = await db
        .update(themeItems)
        .set({ name: name, image: image })
        .where(eq(themeItems.id, id));

    res.json(results);
};

// Delete a theme item from the database
export const deleteThemeItem = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const results = await db.delete(themeItems).where(eq(themeItems.id, id));
    res.json(results);
};
