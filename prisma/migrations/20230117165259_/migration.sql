/*
  Warnings:

  - Added the required column `groupId` to the `Good` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Good_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Good_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Good" ("completed", "createdAt", "id", "title", "updatedAt", "userId") SELECT "completed", "createdAt", "id", "title", "updatedAt", "userId" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
