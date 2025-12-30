/**
 * AuthLab hashing demo helpers.
 * NOTE: In real auth systems, hashing is done on the server (never in the browser).
 * For teaching, we keep a very small demo endpoint that returns example hashes.
 *
 * Supabase itself hashes passwords securely internally (bcrypt/scrypt-like).
 * We do NOT manage real password hashing in this app.
 */
export type HashDemoResult = {
  input: string;
  output: string;
  note: string;
};
