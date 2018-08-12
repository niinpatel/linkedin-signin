module.exports = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/linkedin-signin",
  linkedinKey: process.env.LINKEDIN_KEY || "81hgqjt8upjpv4",
  linkedinSecret: process.env.LINKEDIN_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || "secret"
};
