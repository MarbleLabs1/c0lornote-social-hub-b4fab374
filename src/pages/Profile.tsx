
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings } from "lucide-react";
import { Post } from "@/components/posts/PostCard";
import PostsList from "@/components/posts/PostsList";
import { Link } from "react-router-dom";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<{
    id: string;
    username: string;
    avatar: string;
    bio?: string;
    followers: number;
    following: number;
    postsCount: number;
  } | null>(null);
  
  const isOwnProfile = !id || id === user?.id;
  
  // Load profile data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the current user or mock data
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isOwnProfile && user) {
        setProfileUser({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          bio: "This is my c0lornote profile where I share my colorful moments!",
          followers: 142,
          following: 98,
          postsCount: 27,
        });
      } else {
        // Mock data for other profiles
        setProfileUser({
          id: id || "user-mock",
          username: id ? `user_${id.slice(0, 5)}` : "guest_user",
          avatar: "https://source.unsplash.com/random/400x400?portrait",
          bio: "Color enthusiast and digital creator",
          followers: 356,
          following: 215,
          postsCount: 42,
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [id, user, isOwnProfile]);
  
  // Load user posts from localStorage
  useEffect(() => {
    const storedPosts = localStorage.getItem("c0lornote_posts");
    if (storedPosts) {
      try {
        const allPosts = JSON.parse(storedPosts) as Post[];
        // Filter posts for the current profile
        const profilePosts = isOwnProfile
          ? allPosts.filter(post => post.user.id === user?.id)
          : allPosts.filter(post => post.user.id === id);
          
        setPosts(profilePosts);
      } catch (err) {
        console.error("Failed to parse posts data", err);
      }
    }
  }, [id, user, isOwnProfile]);

  if (isLoading || !profileUser) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="bg-gray-300 rounded-full h-24 w-24"></div>
            <div className="flex-1">
              <div className="bg-gray-300 h-6 w-48 mb-2 rounded"></div>
              <div className="bg-gray-300 h-4 w-72 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={profileUser.avatar} alt={profileUser.username} />
          <AvatarFallback>{profileUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            
            {isOwnProfile ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <Button className="gradient-bg text-white hover:opacity-90">
                Follow
              </Button>
            )}
          </div>
          
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-bold">{profileUser.postsCount}</span>{" "}
              <span className="text-muted-foreground">posts</span>
            </div>
            <div>
              <span className="font-bold">{profileUser.followers}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-bold">{profileUser.following}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>
          
          {profileUser.bio && <p className="text-sm">{profileUser.bio}</p>}
        </div>
      </div>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="tagged">Tagged</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <PostsList 
            posts={posts} 
            emptyMessage={
              isOwnProfile 
                ? "You haven't created any posts yet. Share your first c0lornote!" 
                : "This user hasn't posted anything yet."
            } 
          />
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-10 text-muted-foreground">
            No saved posts yet.
          </div>
        </TabsContent>
        
        <TabsContent value="tagged" className="mt-6">
          <div className="text-center py-10 text-muted-foreground">
            No tagged posts yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
