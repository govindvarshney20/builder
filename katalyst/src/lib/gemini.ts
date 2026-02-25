export async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemInstruction }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to get response from AI. Please try again.");
  }

  const data = await response.json();
  return data.text;
}

export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  systemInstruction?: string
): Promise<string> {
  const response = await fetch("/api/gemini/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemInstruction }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to get response from AI. Please try again.");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response stream.");
  }

  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") break;

      try {
        const parsed = JSON.parse(data);
        if (parsed.error) throw new Error(parsed.error);
        fullText += parsed.text;
        onChunk(fullText);
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }

  return fullText;
}
