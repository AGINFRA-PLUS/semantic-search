export default async function runRequest(body) {
  const response = await fetch("https://api.agroknow.com/search-api/search", {
    method: "POST",
    headers: { "content-type": "application/json", "accept":"application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
