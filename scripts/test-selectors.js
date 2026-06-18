import * as cheerio from "cheerio";

const url = "https://www.chiefrich.com/edu/17268.html";
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
const html = await res.text();
const $ = cheerio.load(html);

console.log("Page length:", html.length);
console.log("");

const selectors = [".newstext", "#contenttxt", ".content", "article", "#MyContent", ".TRS_Editor", ".art_body", ".zhengwen", "#articleContent", ".article-content", "#endText", ".post_body", ".show_content", "#article_content", ".entry-content"];

selectors.forEach(s => {
  const el = $(s);
  console.log(`${s}: ${el.length ? "FOUND (" + el.html().substring(0, 80) + "...)" : "not found"}`);
});
