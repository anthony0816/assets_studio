-- CreateTable
CREATE TABLE "public"."user_avatar_cache" (
    "user_id" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,

    CONSTRAINT "user_avatar_cache_pkey" PRIMARY KEY ("user_id")
);
