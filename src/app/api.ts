function getAPIURL(path: string) {
  const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = new URL(path, host);
  return url.toString();
}

function setTokenLocalStorage(token: string) {
  if (typeof window === "undefined") {
    return null;
  }

  localStorage.setItem("token", token);

  return token;
}

function getTokenLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export async function handleSignIn(payload: Record<string, string>) {
  const url = getAPIURL("/api/auth/login");
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const jsonResponse = await response.json();

  setTokenLocalStorage(jsonResponse?.data?.accessToken);
  console.log(jsonResponse);
  return jsonResponse;
}

export async function handleSignUp(payload: Record<string, string>) {
  const url = getAPIURL("/api/auth/signup");
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getBooks() {
  const token = getTokenLocalStorage();

  if (!token) {
    return null;
  }

  const url = getAPIURL("/api/books/published");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function searchBooks(title: string) {
  const token = getTokenLocalStorage();

  if (!token) {
    return null;
  }

  const url = getAPIURL("/api/books/search?title=" + title);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getBooksByUser() {
  const token = getTokenLocalStorage();

  if (!token) {
    return null;
  }

  const url = getAPIURL("/api/books/user");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function unpublishBook(id: string) {
  const result = confirm("Are you sure you want to unpublish this book?");

  if (!result) {
    return null;
  }

  const token = getTokenLocalStorage();

  if (!token) {
    return null;
  }

  const url = getAPIURL("/api/books/unpublish/" + id);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function publishBook(payload: Record<string, string>) {
  const token = getTokenLocalStorage();

  if (!token) {
    return null;
  }

  const url = getAPIURL("/api/books/publish/");
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

