import { cache } from "chanjs";
import { config } from "chanjs";
const { WEB_CACHE_KEY } = config;

export const clearWebCache = (req) => {
  if (cache) {
    cache.del(WEB_CACHE_KEY);
  }
  if (req.app && req.app.locals) {
    delete req.app.locals.nav;
    delete req.app.locals.category;
    delete req.app.locals.site;
    delete req.app.locals.friendlink;
    delete req.app.locals.frag;
    delete req.app.locals.tag;
  }
};
