CREATE TABLE "admin_login_rate_limits" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"windowStartedAt" timestamp with time zone NOT NULL
);
