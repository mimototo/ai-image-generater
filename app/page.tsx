"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// APIの型定義
interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

const Home = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const engineId = "stable-diffusion-v1-6";
  const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;
  const apiHost = "https://api.stability.ai";

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("プロンプトを入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiHost}/v1/generation/${engineId}/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`エラー: ${await response.text()}`);
      }

      const responseJSON = (await response.json()) as GenerationResponse;
      const base64Image = responseJSON.artifacts[0].base64;
      setGeneratedImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "画像生成中にエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>AI画像生成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="画像生成のプロンプトを入力"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={handleGenerateImage} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "生成"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {generatedImage && !isLoading && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">生成された画像:</h2>
              <div className="relative w-full aspect-square">
                <Image
                  src={generatedImage}
                  alt="Generated Image"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
