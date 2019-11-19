export default async function runRequest(body) {
  const response = await fetch("http://148.251.22.254:8080/search-api-1.0/search/", {
    method: "POST",
    headers: { "content-type": "application/json", "accept":"application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
