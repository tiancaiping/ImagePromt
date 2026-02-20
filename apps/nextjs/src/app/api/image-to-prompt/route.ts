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
  const uploadJson = await uploadResponse.json();
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
  const workflowJson = await workflowResponse.json();
  if (!workflowResponse.ok) {
    return NextResponse.json(
      { error: "Workflow run failed", details: workflowJson },
      { status: workflowResponse.status },
    );
  }

  const output =
    workflowJson?.data?.output ??
    workflowJson?.output ??
    workflowJson?.data?.result ??
    workflowJson?.data?.outputs ??
    null;
  return NextResponse.json({
    output,
    fileId,
    fileUrl,
    raw: workflowJson,
  });
}
