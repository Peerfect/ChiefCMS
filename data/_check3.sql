SELECT
  SUM(content LIKE '%niutoucj.com%') AS niutoucj,
  SUM(content LIKE '%niubencj.com%') AS niubencj,
  SUM(content LIKE '%niuducj.com%') AS niuducj,
  COUNT(*) AS total
FROM cms_article WHERE cid IN (66,67,68,69,70,72);
