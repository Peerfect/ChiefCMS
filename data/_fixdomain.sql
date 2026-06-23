UPDATE cms_article
SET content = REPLACE(REPLACE(REPLACE(REPLACE(content,
  'https://www.niubencj.com','https://www.chiefrich.com'),
  'http://www.niubencj.com','https://www.chiefrich.com'),
  'https://niubencj.com','https://www.chiefrich.com'),
  'http://niubencj.com','https://www.chiefrich.com')
WHERE cid IN (66,67,68,69,70,72) AND content LIKE '%niubencj.com%';
SELECT SUM(content LIKE '%niubencj.com%') AS remain_niubencj FROM cms_article WHERE cid IN (66,67,68,69,70,72);
