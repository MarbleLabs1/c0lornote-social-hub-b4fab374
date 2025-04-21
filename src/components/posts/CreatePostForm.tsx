
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Image, X } from "lucide-react";
import { Post } from "./PostCard";

interface CreatePostFormProps {
  onPostCreated?: (post: Post) => void;
}

export const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption.trim() && !imagePreview) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here we create a new post with mock data
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user: {
          id: user?.id || "user-1",
          username: user?.username || "anonymous",
          avatar: user?.avatar || "https://source.unsplash.com/random/100x100?portrait",
        },
        image: imagePreview || undefined,
        caption: caption,
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        bookmarked: false,
        liked: false,
      };
      
      // In a real app, we would send this to an API
      // But for now we'll just call the callback
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      // Reset the form
      setCaption("");
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        className="resize-none"
      />
      
      {imagePreview && (
        <div className="relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-64 w-auto rounded-md object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Image className="h-5 w-5 mr-2" />
            Add Image
          </Button>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        <Button 
          type="submit"
          disabled={isLoading || (!caption.trim() && !imagePreview)}
          className="gradient-bg text-white hover:opacity-90"
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};
