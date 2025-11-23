// prisma.config.js
const config = {
    adapter: {
        provider: "mysql",
        url: process.env.DATABASE_URL, // lấy từ .env
    },
};

module.exports = config;
