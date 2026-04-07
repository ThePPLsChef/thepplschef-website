import { relations } from "drizzle-orm";
import {
  users,
  eaterProfiles,
  chefProfiles,
  serviceTypes,
  inquiries,
  bookings,
  quotes,
  payments,
  reviews,
  notifications,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  eaterProfiles: many(eaterProfiles),
  chefProfiles: many(chefProfiles),
  notifications: many(notifications),
}));

export const eaterProfilesRelations = relations(eaterProfiles, ({ one, many }) => ({
  user: one(users, { fields: [eaterProfiles.userId], references: [users.id] }),
  inquiries: many(inquiries),
  reviews: many(reviews),
}));

export const chefProfilesRelations = relations(chefProfiles, ({ one, many }) => ({
  user: one(users, { fields: [chefProfiles.userId], references: [users.id] }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const inquiriesRelations = relations(inquiries, ({ one, many }) => ({
  eater: one(eaterProfiles, { fields: [inquiries.eaterId], references: [eaterProfiles.id] }),
  serviceType: one(serviceTypes, { fields: [inquiries.serviceTypeId], references: [serviceTypes.id] }),
  bookings: many(bookings),
  quotes: many(quotes),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  inquiry: one(inquiries, { fields: [bookings.inquiryId], references: [inquiries.id] }),
  chef: one(chefProfiles, { fields: [bookings.chefId], references: [chefProfiles.id] }),
  payments: many(payments),
  reviews: many(reviews),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  inquiry: one(inquiries, { fields: [quotes.inquiryId], references: [inquiries.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  eater: one(eaterProfiles, { fields: [reviews.eaterId], references: [eaterProfiles.id] }),
  chef: one(chefProfiles, { fields: [reviews.chefId], references: [chefProfiles.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
