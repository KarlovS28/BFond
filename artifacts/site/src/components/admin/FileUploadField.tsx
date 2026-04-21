import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFileToStorage, publicUrlForObject } from "@/lib/upload";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, X } from "lucide-react";

interface FileUploadFieldProps {
  value: string;
  onChange: (path: string) => void;
  accept?: string;
  preview?: "image" | "file" | "none";
  required?: boolean;
  hint?: string;
}

export function FileUploadField({
  value,
  onChange,
  accept = "image/*",
  preview = "image",
  required,
  hint,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handlePick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadFileToStorage(file);
      onChange(path);
      toast({ title: "Файл загружен", description: file.name });
    } catch (err) {
      toast({
        title: "Ошибка загрузки",
        description: err instanceof Error ? err.message : "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={handlePick} disabled={uploading} className="gap-2">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Загрузка..." : value ? "Заменить файл" : "Выбрать файл"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="text-destructive"
            title="Удалить"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {required && !value && <span className="text-destructive text-xs">обязательно</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {value && preview === "image" && (
        <img
          src={publicUrlForObject(value)}
          alt="Превью"
          className="h-24 w-24 object-cover rounded-lg border border-border"
        />
      )}
      {value && preview === "file" && (
        <a
          href={publicUrlForObject(value)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline break-all"
        >
          Открыть файл
        </a>
      )}
    </div>
  );
}
