CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'reviewed', 'quoted', 'booked', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'eater', 'chef');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"inquiryId" integer,
	"chefId" integer,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"totalAmount" numeric(10, 2),
	"depositAmount" numeric(10, 2),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chef_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"name" varchar(255) NOT NULL,
	"bio" text,
	"specialties" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eater_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"eaterId" integer,
	"serviceTypeId" integer,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"eventDate" varchar(50),
	"eventTime" varchar(50),
	"location" varchar(500),
	"guestCount" varchar(50),
	"budget" varchar(100),
	"foodPreferences" text,
	"allergies" text,
	"notes" text,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"type" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookingId" integer,
	"amount" numeric(10, 2) NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paymentMethod" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"inquiryId" integer,
	"totalAmount" numeric(10, 2),
	"notes" text,
	"status" "quote_status" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookingId" integer,
	"eaterId" integer,
	"chefId" integer,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"passwordHash" varchar(255),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_inquiryId_inquiries_id_fk" FOREIGN KEY ("inquiryId") REFERENCES "public"."inquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_chefId_chef_profiles_id_fk" FOREIGN KEY ("chefId") REFERENCES "public"."chef_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chef_profiles" ADD CONSTRAINT "chef_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eater_profiles" ADD CONSTRAINT "eater_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_eaterId_eater_profiles_id_fk" FOREIGN KEY ("eaterId") REFERENCES "public"."eater_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_serviceTypeId_service_types_id_fk" FOREIGN KEY ("serviceTypeId") REFERENCES "public"."service_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_bookings_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_inquiryId_inquiries_id_fk" FOREIGN KEY ("inquiryId") REFERENCES "public"."inquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_bookings_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_eaterId_eater_profiles_id_fk" FOREIGN KEY ("eaterId") REFERENCES "public"."eater_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_chefId_chef_profiles_id_fk" FOREIGN KEY ("chefId") REFERENCES "public"."chef_profiles"("id") ON DELETE no action ON UPDATE no action;