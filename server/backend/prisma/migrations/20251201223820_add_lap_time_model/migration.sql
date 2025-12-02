-- CreateTable
CREATE TABLE "LapTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nickName" TEXT NOT NULL,
    "bestLapTimeMs" INTEGER NOT NULL,
    "formattedTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LapTime_nickName_key" ON "LapTime"("nickName");
