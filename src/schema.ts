import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  assetNumber: text("asset_number"),
  category: text("category"),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loanRecords = pgTable("loan_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),
  borrowerName: text("borrower_name").notNull(),
  loanedAt: timestamp("loaned_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  returnedAt: timestamp("returned_at", { mode: "date", withTimezone: true }),
});
