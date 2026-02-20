import { NextResponse } from "next/server";

import { env } from "~/env.mjs";

export async function POST(req: Request) {
  if (!env.COZE_API_TOKEN || !env.COZE_WORKFLOW_ID) {
    return NextResponse.json(
      { error: "Missing Coze configuration" },
      { status: 500 },
    );
  }
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const userQuery =
    typeof formData.get("userQuery") === "string"
      ? String(formData.get("userQuery"))
      : "";
  const promptType =
    typeof formData.get("promptType") === "string"
      ? String(formData.get("promptType"))
      : "";

  const baseUrl = env.COZE_API_BASE ?? "https://api.coze.cn";

  const uploadForm = new FormData();
  uploadForm.append("file", file, file.name);
  const uploadResponse = await fetch(`${baseUrl}/v1/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.COZE_API_TOKEN}`,
    },
    body: uploadForm,
  });
  const uploadJson = (await uploadResponse.json()) as {
    data?: {
      id?: string;
      file_id?: string;
      file_url?: string;
    };
    file_id?: string;
    id?: string;
    file_url?: string;
  };
  if (!uploadResponse.ok) {
    return NextResponse.json(
      { error: "File upload failed", details: uploadJson },
      { status: uploadResponse.status },
    );
  }

  const fileId =
    uploadJson?.data?.id ??
    uploadJson?.data?.file_id ??
    uploadJson?.file_id ??
    uploadJson?.id ??
    null;
  const fileUrl = uploadJson?.data?.file_url ?? uploadJson?.file_url ?? null;
  const parameters: Record<string, string> = {
    userQuery,
    promptType,
  };
  if (fileId) {
    parameters.file_id = String(fileId);
  }
  if (fileUrl) {
    parameters.file_url = String(fileUrl);
  }

  const workflowResponse = await fetch(`${baseUrl}/v1/workflow/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.COZE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflow_id: env.COZE_WORKFLOW_ID,
      parameters,
    }),
  });
  const workflowJson = (await workflowResponse.json()) as {
    data?: {
      output?: unknown;
      result?: unknown;
      outputs?: unknown;
    };
    output?: unknown;
  };
  if (!workflowResponse.ok) {
    return NextResponse.json(
      { error: "Workflow run failed", details: workflowJson },
      { status: workflowResponse.status },
    );
  }

  const rawOutput =
    workflowJson?.data?.output ??
    workflowJson?.output ??
    workflowJson?.data?.result ??
    workflowJson?.data?.outputs ??
    null;
  const parseJsonIfString = (value: unknown): unknown => {
    if (typeof value !== "string") {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed;
    } catch {
      return null;
    }
  };
  const extractFromObject = (value: Record<string, unknown>): string | null => {
    if (typeof value.output === "string") return value.output;
    if (typeof value.text === "string") return value.text;
    if (typeof value.value === "string") return value.value;
    const nested = value.output ?? value.data ?? value.result ?? value.outputs;
    if (typeof nested === "string") return nested;
    if (nested && typeof nested === "object") {
      return extractFromObject(nested as Record<string, unknown>);
    }
    return null;
  };
  const extractFromArray = (value: unknown[]): string | null => {
    for (const item of value) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const extracted = extractFromObject(item as Record<string, unknown>);
        if (typeof extracted === "string") return extracted;
      }
    }
    return null;
  };
  const parsedOutput = parseJsonIfString(rawOutput);
  const fallbackParsed = parseJsonIfString(workflowJson);
  const stringOutput = typeof rawOutput === "string" ? rawOutput : null;
  const parsedObjectOutput =
    parsedOutput && typeof parsedOutput === "object"
      ? extractFromObject(parsedOutput as Record<string, unknown>)
      : null;
  const arrayOutput = Array.isArray(rawOutput) ? extractFromArray(rawOutput) : null;
  const objectOutput =
    rawOutput && typeof rawOutput === "object"
      ? extractFromObject(rawOutput as Record<string, unknown>)
      : null;
  const fallbackOutput =
    fallbackParsed && typeof fallbackParsed === "object"
      ? extractFromObject(fallbackParsed as Record<string, unknown>)
      : null;
  const output =
    stringOutput ??
    parsedObjectOutput ??
    arrayOutput ??
    objectOutput ??
    fallbackOutput;
  return NextResponse.json({
    output,
    fileId,
    fileUrl,
    raw: workflowJson,
  });
}
