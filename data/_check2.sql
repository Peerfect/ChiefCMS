SELECT cid,
  SUM(description IS NULL OR description='') AS empty_desc,
  COUNT(*) AS total
FROM cms_article WHERE cid IN (66,67) GROUP BY cid;
