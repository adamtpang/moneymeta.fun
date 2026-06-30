import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** The "decks", wealth vehicles being ranked. */
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  // asset_class | crypto | company | country | person
  category: text("category").notNull(),
  description: text("description"),
  sourceUrl: text("source_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Time series, one row per vehicle per capture. Growth + meta score are
 *  computed from snapshot history, never stored here. */
export const snapshots = pgTable(
  "snapshots",
  {
    id: serial("id").primaryKey(),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    marketCap: numeric("market_cap", { precision: 30, scale: 2 }).notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    vehicleIdx: index("snapshots_vehicle_idx").on(t.vehicleId),
  }),
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type Snapshot = typeof snapshots.$inferSelect;
export type NewSnapshot = typeof snapshots.$inferInsert;
