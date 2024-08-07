import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const themes = pgTable("theme", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    maxRanking: integer("max_ranking").notNull(),
});

export const themesRelations = relations(themes, ({ many }) => ({
    themeItems: many(themeItems)
}));

export const themeItems = pgTable("theme_item", {
    id: serial("id").primaryKey(),
    themeId: integer("theme_id").notNull().references(() => themes.id, { onDelete: "cascade" }),
    name: text("name"),
    image: text("image"),
})

export const themeItemsRelations = relations(themeItems, ({ one }) => ({
    theme: one(themes, {
        fields: [themeItems.themeId],
        references: [themes.id]
    })
}));

export type InsertTheme = typeof themes.$inferInsert;
export type SelectTheme = typeof themes.$inferSelect;

export type InsertThemeItem = typeof themeItems.$inferInsert;
export type SelectThemeItem = typeof themeItems.$inferSelect;