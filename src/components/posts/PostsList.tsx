
import React from "react";
import { Post, PostCard } from "@/components/posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PostsListProps {
  posts: Post[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const PostsList = ({
  posts,
  isLoading = false,
  emptyMessage = "No posts to display yet."
}: PostsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-background border rounded-lg shadow-sm animate-pulse space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-c0lor-purple/20" />
              <div>
                <Skeleton className="h-4 w-32 mb-2 bg-c0lor-purple/10" />
                <Skeleton className="h-3 w-24 mt-1 bg-muted/30" />
              </div>
            </div>
            <Skeleton className="h-4 w-11/12 bg-card/60" />
            <Skeleton className="h-[250px] w-full rounded-lg bg-muted/50" />
          </div>
        ))}
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground fade-in">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=200&q=80"
          alt="Empty state illustration"
          className="mb-8 w-32 h-32 object-cover rounded-full opacity-60 border-4 border-c0lor-purple/20 shadow-lg"
        />
        <p className="text-lg font-semibold mb-2">{emptyMessage}</p>
        <p className="text-base text-muted-foreground max-w-xs text-center">Create your first post or log in to see posts from your community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="max-w-2xl mx-auto bg-background border border-muted rounded-xl shadow hover:shadow-md transition-shadow fade-in"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostsList;

