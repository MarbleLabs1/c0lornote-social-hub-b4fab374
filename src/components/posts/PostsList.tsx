
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
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
