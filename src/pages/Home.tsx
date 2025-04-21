
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Post } from "@/components/posts/PostCard";
import PostsList from "@/components/posts/PostsList";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts from localStorage on initial render
  useEffect(() => {
    const storedPosts = localStorage.getItem("c0lornote_posts");
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (err) {
        console.error("Failed to parse posts data", err);
      }
    }
    setIsLoading(false);
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("c0lornote_posts", JSON.stringify(posts));
    }
  }, [posts]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Post created successfully!");
  };

  return (
    <div className="container py-6 max-w-4xl">
      {isAuthenticated && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold mb-6">Feed</h2>
      
      <PostsList posts={posts} isLoading={isLoading} />
    </div>
  );
}
