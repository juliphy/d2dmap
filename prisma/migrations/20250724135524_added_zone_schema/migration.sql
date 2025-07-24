-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "points" JSONB NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);
