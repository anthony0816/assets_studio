-- CreateTable
CREATE TABLE "public"."AssetTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AssetTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AssetToAssetTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AssetToAssetTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetTag_name_key" ON "public"."AssetTag"("name");

-- CreateIndex
CREATE INDEX "_AssetToAssetTag_B_index" ON "public"."_AssetToAssetTag"("B");

-- AddForeignKey
ALTER TABLE "public"."_AssetToAssetTag" ADD CONSTRAINT "_AssetToAssetTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AssetToAssetTag" ADD CONSTRAINT "_AssetToAssetTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AssetTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
