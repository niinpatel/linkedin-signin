module.exports = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/linkedin-signin",
  linkedinKey: process.env.LINKEDIN_KEY || "81oynrgqpfcd7f",
  linkedinSecret: process.env.LINKEDIN_SECRET || "LqUaWmmMnfVS83h4",
  url: process.env.URL || "http://127.0.0.1:5000"
};
