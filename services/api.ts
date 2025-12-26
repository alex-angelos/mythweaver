const API_BASE =
  "https://us-central1-mythweaver-mvp.cloudfunctions.net";

/* ===============================
   GET
=============================== */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    let errorMessage = "Erro na API";
    try {
      const err = await response.json();
      errorMessage = err.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

/* ===============================
   POST
=============================== */
export async function apiPost<T>(
  url: string,
  body: any
): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errorMessage = "Erro na API";
    try {
      const err = await response.json();
      errorMessage = err.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}
