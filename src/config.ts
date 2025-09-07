export const CONFIG = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/neitec',
  OPEN_AI: {
    API_KEY: process.env.OPEN_AI_API_KEY || 'asdasdsad',
  },
};
