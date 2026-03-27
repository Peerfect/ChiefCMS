export let statics = [
  {
    prefix: "/public/",
    dir: "public",
    maxAge: 24 * 60 * 60 * 1000, // 1天
  },
  {
    prefix: "/",
    dir: "public",
    maxAge: 24 * 60 * 60 * 1000, // 1天
  },
];

export default {
  statics,
};
