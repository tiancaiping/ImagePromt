"use client";

import * as React from "react";

import { Button } from "@saasfly/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";
import { Input } from "@saasfly/ui/input";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";

export default function ImageToPromptPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [userQuery, setUserQuery] = React.useState("");
  const [promptType, setPromptType] = React.useState("");
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isLoading) {
      return;
    }
    setIsLoading(true);
    setError("");
    setResult("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("userQuery", userQuery);
      body.append("promptType", promptType);

      const response = await fetch("/api/image-to-prompt", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "请求失败");
        return;
      }
      const output = data?.output;
      setResult(
        typeof output === "string" ? output : JSON.stringify(output, null, 2),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Image to Prompt"
        text="上传图片并生成提示词"
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>图片生成提示词</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
              />
              <Input
                placeholder="userQuery"
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
              />
              <Input
                placeholder="promptType"
                value={promptType}
                onChange={(event) => setPromptType(event.target.value)}
              />
              <Button type="submit" disabled={!file || isLoading}>
                {isLoading && (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                生成提示词
              </Button>
            </form>
          </CardContent>
        </Card>
        {error ? (
          <div className="rounded-md border border-destructive bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {result ? (
          <div className="rounded-md border p-4 text-sm whitespace-pre-wrap">
            {result}
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
