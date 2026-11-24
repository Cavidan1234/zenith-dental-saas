import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// 1. Tenants Table
// ---------------------------------------------------------------------------
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  brandColor: text('brand_color').default('#0f766e'),
  timezone: text('timezone').notNull().default('Europe/London'),
  currency: text('currency').notNull().default('GBP'),
  depositAmountCents: integer('deposit_amount_cents').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('tenants_slug_idx').on(table.slug),
]);

// ---------------------------------------------------------------------------
// 2. Users Table
// ---------------------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('customer'), // 'owner' | 'staff' | 'customer'
  name: text('name').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('users_tenant_email_idx').on(table.tenantId, table.email),
]);

// ---------------------------------------------------------------------------
// 3. Staff Table
// ---------------------------------------------------------------------------
export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(), // e.g. "Orthodontist & Aesthetician"
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  specializations: jsonb('specializations').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('staff_tenant_idx').on(table.tenantId),
]);

// ---------------------------------------------------------------------------
// 4. Staff Schedules Table
// ---------------------------------------------------------------------------
export const staffSchedules = pgTable('staff_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  staffId: uuid('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sun, 1 = Mon, ... 6 = Sat
  startTime: text('start_time').notNull(), // e.g. "09:00"
  endTime: text('end_time').notNull(),     // e.g. "18:00"
  breakStart: text('break_start'),         // e.g. "13:00"
  breakEnd: text('break_end'),             // e.g. "14:00"
  isActive: boolean('is_active').notNull().default(true),
}, (table) => [
  index('staff_schedules_staff_day_idx').on(table.staffId, table.dayOfWeek),
]);

// ---------------------------------------------------------------------------
// 5. Services Table
// ---------------------------------------------------------------------------
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').notNull().default(45),
  bufferMinutes: integer('buffer_minutes').notNull().default(15),
  priceCents: integer('price_cents').notNull().default(0),
  depositCents: integer('deposit_cents').notNull().default(0),
  category: text('category'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('services_tenant_idx').on(table.tenantId),
  uniqueIndex('services_tenant_slug_idx').on(table.tenantId, table.slug),
]);

// ---------------------------------------------------------------------------
// 6. Bookings Table
// ---------------------------------------------------------------------------
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  staffId: uuid('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  bookingCode: text('booking_code'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_surgery'
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  paymentStatus: text('payment_status').notNull().default('unpaid'), // 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded'
  paymentMethod: text('payment_method'),
  paymentLabel: text('payment_label'),
  depositAmountCents: integer('deposit_amount_cents').default(0),
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('bookings_tenant_staff_time_idx').on(table.tenantId, table.staffId, table.startTime, table.endTime),
  index('bookings_status_idx').on(table.status),
  uniqueIndex('bookings_code_idx').on(table.bookingCode),
]);

// ---------------------------------------------------------------------------
// 7. Webhook Events Table (Strict Idempotency)
// ---------------------------------------------------------------------------
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: text('event_id').notNull().unique(),
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).defaultNow().notNull(),
  payload: jsonb('payload'),
}, (table) => [
  uniqueIndex('webhook_events_event_id_idx').on(table.eventId),
]);

// ---------------------------------------------------------------------------
// 8. Recall Reminders Table
// ---------------------------------------------------------------------------
export const recallReminders = pgTable('recall_reminders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  lastVisitDate: timestamp('last_visit_date', { withTimezone: true }).notNull(),
  recallDueDate: timestamp('recall_due_date', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('scheduled'), // 'scheduled' | 'sent' | 'booked'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('recall_reminders_tenant_idx').on(table.tenantId),
  index('recall_reminders_due_date_idx').on(table.recallDueDate),
]);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  staff: many(staff),
  services: many(services),
  bookings: many(bookings),
  recallReminders: many(recallReminders),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  staff: one(staff, {
    fields: [users.id],
    references: [staff.userId],
  }),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [staff.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),
  schedules: many(staffSchedules),
  bookings: many(bookings),
}));

export const staffSchedulesRelations = relations(staffSchedules, ({ one }) => ({
  staff: one(staff, {
    fields: [staffSchedules.staffId],
    references: [staff.id],
  }),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [services.tenantId],
    references: [tenants.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [bookings.tenantId],
    references: [tenants.id],
  }),
  staff: one(staff, {
    fields: [bookings.staffId],
    references: [staff.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));

export const recallRemindersRelations = relations(recallReminders, ({ one }) => ({
  tenant: one(tenants, {
    fields: [recallReminders.tenantId],
    references: [tenants.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred TypeScript Types
// ---------------------------------------------------------------------------
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;

export type StaffSchedule = typeof staffSchedules.$inferSelect;
export type NewStaffSchedule = typeof staffSchedules.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type NewWebhookEvent = typeof webhookEvents.$inferInsert;

export type RecallReminder = typeof recallReminders.$inferSelect;
export type NewRecallReminder = typeof recallReminders.$inferInsert;
