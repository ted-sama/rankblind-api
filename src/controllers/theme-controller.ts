import { Request, Response } from "express";

// Get data from database with drizzle
import { db } from "db/db";
import { themes, themeItems } from "db/schema";
import { eq } from "drizzle-orm";

// Get all themes from the database
export const getAllThemes = async (req: Request, res: Response) => {
    const results = await db.query.themes.findMany();

    // For image property, add the full path
    results.forEach((theme: any) => {
        theme.image = `http://localhost:80/image/${theme.image}`;
    });

    res.json(results);
    console.log("All themes fetched");
};

// Get a theme by ID from the database
export const getThemeById = async (req: Request, res: Response) => {
    // Find the theme by ID
    const results = await db.query.themes.findFirst({
        where: eq(themes.id, parseInt(req.params.id)),
        with: {
            themeItems: true,
        },
    });
    // For theme image property, add the full path
    results!.image = `http://localhost:80/image/${results!.image}`;

    // Same for theme items
    results!.themeItems.forEach((item: any) => {
        item.image = `http://localhost:80/image/${item.image}`;
    });

    res.json(results);
};

// Add a new theme to the database
export const addTheme = async (req: Request, res: Response) => {
    // Get the theme properties from the request
    const name: string = req.body.name;
    const description: string = req.body.description;
    const maxRanking: number = parseInt(req.body.max_ranking);
    const image: string = req.file!.filename;

    // Insert the new theme into the database
    const results = await db
        .insert(themes)
        .values({
            name: name,
            description: description,
            maxRanking: maxRanking,
            image: image,
        })
        .returning();

    res.json(results);
};

// Update a theme in the database
export const updateTheme = async (req: Request, res: Response) => {
    // Get the theme properties from the request
    const id: number = parseInt(req.params.id);
    const name: string = req.body.name;
    const description: string = req.body.description;
    var maxRanking: number = parseInt(req.body.max_ranking);

    // If the maxRanking is greater than the number of items in the theme, set it to the number of items
    const items = await db.query.themeItems.findMany({
        where: eq(themeItems.themeId, id),
    });

    if (maxRanking > items.length) {
        maxRanking = items.length;
    } else if (maxRanking > 10) {
        maxRanking = 10;
    }

    // Update the theme in the database
    const results = await db
        .update(themes)
        .set({ name: name, description: description, maxRanking: maxRanking })
        .where(eq(themes.id, id));

    res.json(results);
};

// Update a theme image in the database
export const updateThemeImage = async (req: Request, res: Response) => {
    // Get the theme properties from the request
    const id: number = parseInt(req.params.id);
    const image: string = req.file!.filename;

    // Update the theme image in the database
    const results = await db
        .update(themes)
        .set({ image: image })
        .where(eq(themes.id, id));

    res.json(results);
};

// Delete a theme from the database
export const deleteTheme = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    // Delete the theme items associated with the theme from the database
    await db.delete(themeItems).where(eq(themeItems.themeId, id));

    // Then delete the theme from the database
    const results = await db.delete(themes).where(eq(themes.id, id));

    res.json(results);
};