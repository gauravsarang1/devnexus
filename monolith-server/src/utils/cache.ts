import redisClient from "../config/redis.js";

export const getCache = async (key: string) => {
    return await redisClient.get(key);
};

export const setCache = async (
    key: string,
    value: unknown,
    ttl = 60
) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: ttl,
    });
};

export const deleteChache = async (key: string) => {
    await redisClient.del(key);
}

export const invalidateMatchCache = async (userId: string, matchId: string) => {
    const patterns = [
        `match:user:${userId}:page:*:type:*`,
        `match:data:${matchId}`
    ];

    for (const pattern of patterns) {
        const keys = await redisClient.keys(pattern);
        if (keys.length) {
            await redisClient.del(keys);
        }
    }
};

