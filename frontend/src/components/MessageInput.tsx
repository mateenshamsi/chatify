// MessageInput.tsx
import React, { useRef, useState } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { Textarea } from "./ui/textarea";

type MessageInputProps = {
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: (text: string, image?: File) => void;
};

function MessageInput({ message, setMessage, onSendMessage }: MessageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent
  ) => {
    e.preventDefault();
    if (message.trim() || selectedImage) {
      onSendMessage(message.trim(), selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white shrink-0">
      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#BC6C25] focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white transition-all duration-200"
            style={{ minHeight: "48px", maxHeight: "120px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
        </div>

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
        >
          <ImageIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() && !selectedImage}
          className={`p-3 rounded-2xl transition-all duration-200 ${
            message.trim() || selectedImage
              ? "bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] text-white shadow-md hover:shadow-lg hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block mt-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>Press Enter to send, Shift + Enter for new line</span>
      </div>
    </div>
  );
}

export default MessageInput;
