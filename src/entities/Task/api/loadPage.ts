const LoadPages = async (page = 2) => {
  const btn = document.querySelector(".main-grid-more-btn");
  if (!btn) return false;

  const raw = btn.getAttribute("onclick");
  if (!raw) return false;

  console.log("Raw onclick:", raw);

  // Вытаскиваем содержимое вызова BX.ajax.insertToNode(...)
  const match = raw.match(/BX\.ajax\.insertToNode\(([^)]+)\)/);
  if (!match) return false;

  // Парсим аргументы из вызова
  const args = match[1]
    .split(",")
    .map(s => s.trim().replace(/^['"]|['"]$/g, ""));

  const [baseUrl, insertTarget] = args;
  if (!baseUrl) return false;

  const urlObj = new URL(baseUrl, window.location.origin);
  console.log("Next page URL:", urlObj.href);
  console.log("Params:", Object.fromEntries(urlObj.searchParams.entries()));

  // Пробегаем по страницам
  for (let i = 2; i <= page; i++) {
    const nextUrl = baseUrl.replace(/page=\d+/, `page=${i}`);
    console.log(`Loading page ${i}:`, nextUrl);

    setTimeout(() => window.BX.ajax.insertToNode(nextUrl, insertTarget), 2500 * i);
  }

  return false;
};

export default LoadPages;
