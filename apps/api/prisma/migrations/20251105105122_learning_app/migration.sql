-- CreateTable
CREATE TABLE "CardParam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "random" BOOLEAN NOT NULL DEFAULT false,
    "translationOnVerso" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardParam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardParam" ADD CONSTRAINT "CardParam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
