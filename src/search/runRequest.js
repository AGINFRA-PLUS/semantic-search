export default async function runRequest(body) {
  const response = await fetch("http://52.214.72.17:9091/search/", {
    method: "POST",
    headers: { "content-type": "application/json", "accept":"application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
