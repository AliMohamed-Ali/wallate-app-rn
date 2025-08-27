import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("transactions");
    if (!success) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }
    next();
  } catch (error) {
    console.log("Rate limit error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default rateLimiter;
