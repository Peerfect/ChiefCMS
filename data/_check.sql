SELECT
  SUM(content LIKE '%shortpixel%') AS shortpixel,
  SUM(content LIKE '%fxgoplus%') AS fxgoplus,
  SUM(content LIKE '%/d/file/%') AS d_file_remote,
  SUM(content LIKE '%src="http%') AS abs_http_img,
  COUNT(*) AS total
FROM cms_article WHERE cid=66;
