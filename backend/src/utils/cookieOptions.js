// utils/cookieOptions.js
export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
};
