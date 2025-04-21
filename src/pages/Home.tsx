
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Post } from "@/components/posts/PostCard";
import PostsList from "@/components/posts/PostsList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts from localStorage on initial render
  useEffect(() => {
    const storedPosts = localStorage.getItem("c0lornote_posts");
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        // Sort posts by date (newest first)
        parsedPosts.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(parsedPosts);
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
      {isAuthenticated ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </CardContent>
        </Card>
      ) : (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-2 gradient-text">Join c0lornote today!</h2>
          <p className="text-muted-foreground mb-4">Sign in to create posts, follow friends, and customize your profile.</p>
          <Button asChild className="gradient-bg text-white hover:opacity-90">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Feed</h2>
      
      <PostsList posts={posts} isLoading={isLoading} />
    </div>
  );
}
