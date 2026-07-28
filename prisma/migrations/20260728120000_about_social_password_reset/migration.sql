-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "aboutTitle" TEXT DEFAULT 'Quem somos';
ALTER TABLE "SiteSettings" ADD COLUMN "aboutHtml" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "aboutImageUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "youtubeUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "tiktokUrl" TEXT;

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");
