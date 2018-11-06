export function setCacheKey (req, res, next) {
  res.express_redis_cache_name = JSON.stringify(req.query)
  next()
}
