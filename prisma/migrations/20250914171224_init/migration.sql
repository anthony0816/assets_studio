-- CreateTable
CREATE TABLE "public"."categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT 'other',

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);
