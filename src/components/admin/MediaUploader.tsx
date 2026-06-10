"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Film, GripVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { adminApi } from "@/lib/api";

interface MediaItem {
  url: string;
  type: "image" | "video";
  originalName?: string;
}

interface MediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxFiles?: number;
  label?: string;
  single?: boolean; // for section cover image (single file)
}

export default function MediaUploader({ media, onChange, maxFiles = 10, label = "Media", single = false }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    
    setUploading(true);
    try {
      const result = await adminApi.uploadFiles(fileArray);
      const newMedia: MediaItem[] = result.files.map((f: any) => ({
        url: f.url,
        type: f.type,
        originalName: f.originalName,
      }));

      if (single) {
        onChange(newMedia.slice(0, 1));
      } else {
        onChange([...media, ...newMedia].slice(0, maxFiles));
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [media, onChange, maxFiles, single]);

  const handleRemove = (index: number) => {
    const updated = [...media];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#1E1533]/50 uppercase tracking-wider mb-2">{label}</label>
      
      {/* Preview Grid */}
      {media.length > 0 && (
        <div className={`grid ${single ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-4"} gap-2 mb-3`}>
          {media.map((item, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F8F6F3] border border-[#1E1533]/5">
              {item.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1E1533]/5">
                  <Film className="w-8 h-8 text-[#1E1533]/20" />
                  <span className="absolute bottom-1 text-[8px] text-[#1E1533]/30 truncate px-1">{item.originalName}</span>
                </div>
              ) : (
                <Image src={item.url} alt="" fill className="object-cover" sizes="120px" />
              )}
              <button
                onClick={() => handleRemove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>
              {!single && (
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {(single ? media.length === 0 : media.length < maxFiles) && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#C58F7A] bg-[#C58F7A]/5"
              : "border-[#1E1533]/10 hover:border-[#C58F7A]/40 hover:bg-[#C58F7A]/[0.02]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#C58F7A] animate-spin" />
              <p className="text-xs text-[#1E1533]/40">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#C58F7A]/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#C58F7A]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#1E1533]/60">Drop files here or click to browse</p>
                <p className="text-[10px] text-[#1E1533]/30 mt-0.5">JPG, PNG, WebP, GIF, MP4 • Max 50MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        multiple={!single}
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />
    </div>
  );
}
