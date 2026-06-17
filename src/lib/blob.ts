/** Vercel Blob via token (legado) ou OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN). */
export function hasVercelBlob() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}
