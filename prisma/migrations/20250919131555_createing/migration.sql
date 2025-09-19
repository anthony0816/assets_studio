-- CreateTable
CREATE TABLE "public"."Coment" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComentLike" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "coment_id" INTEGER NOT NULL,

    CONSTRAINT "ComentLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Coment" ADD CONSTRAINT "Coment_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComentLike" ADD CONSTRAINT "ComentLike_coment_id_fkey" FOREIGN KEY ("coment_id") REFERENCES "public"."Coment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
