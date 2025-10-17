-- CreateTable
CREATE TABLE "public"."opengameart_title_url" (
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_es" TEXT NOT NULL,
    "preview_file_name" TEXT NOT NULL,

    CONSTRAINT "opengameart_title_url_pkey" PRIMARY KEY ("url")
);
