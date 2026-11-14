const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const reviewCode = async (diff) => {
  if (!diff || !diff.trim()) {
    throw new Error("Please provide a Git diff before starting the review.");
  }

  const response = await fetch(`${API_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ diff }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || `Review failed with status ${response.status}`,
    );
  }

  return data;
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace(/\/api\/?$/, "")}/health`);

    return response.ok;
  } catch {
    return false;
  }
};
