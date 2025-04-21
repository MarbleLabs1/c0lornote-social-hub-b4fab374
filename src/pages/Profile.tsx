
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings } from "lucide-react";
import { Post } from "@/components/posts/PostCard";
import PostsList from "@/components/posts/PostsList";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: ""
  });
  const navigate = useNavigate();
  
  const [profileUser, setProfileUser] = useState<{
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    followers: number;
    following: number;
    postsCount: number;
  } | null>(null);
  
  const isOwnProfile = !id || (user && id === user?.id);
  
  // Redirect to login if not authenticated and trying to view own profile
  useEffect(() => {
    if (!isAuthenticated && !id) {
      navigate("/login");
    }
  }, [isAuthenticated, id, navigate]);

  // Load profile data
  useEffect(() => {
    setIsLoading(true);
    
    // Check if it's the current user's profile
    if (isOwnProfile && user) {
      setProfileUser({
        id: user.id,
        username: user.username,
        name: user.name || user.username,
        avatar: user.avatar,
        bio: user.bio || "This is my c0lornote profile where I share my colorful moments!",
        followers: 0,
        following: 0,
        postsCount: 0,
      });
      
      // Initialize edit form data
      setProfileForm({
        name: user.name || user.username,
        username: user.username,
        bio: user.bio || "",
        avatar: user.avatar
      });
      
      setIsLoading(false);
    } else if (id) {
      // Look up the user in localStorage
      const usersStr = localStorage.getItem("c0lornote_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const foundUser = users.find((u: any) => u.id === id);
        
        if (foundUser) {
          setProfileUser({
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name || foundUser.username,
            avatar: foundUser.avatar,
            bio: foundUser.bio || `This is ${foundUser.name || foundUser.username}'s c0lornote profile!`,
            followers: 0,
            following: 0,
            postsCount: 0,
          });
        } else {
          // User not found
          setProfileUser({
            id: id,
            username: "unknown",
            name: "Unknown User",
            avatar: "https://source.unsplash.com/random/400x400?silhouette",
            bio: "This user doesn't exist",
            followers: 0,
            following: 0,
            postsCount: 0,
          });
        }
      }
      setIsLoading(false);
    }
  }, [id, user, isOwnProfile]);
  
  // Load user posts from localStorage
  useEffect(() => {
    const storedPosts = localStorage.getItem("c0lornote_posts");
    if (storedPosts) {
      try {
        const allPosts = JSON.parse(storedPosts) as Post[];
        // Filter posts for the current profile
        const profileId = isOwnProfile ? user?.id : id;
        const profilePosts = allPosts.filter(post => post.user.id === profileId);
        
        setPosts(profilePosts);
        
        // Update post count
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            postsCount: profilePosts.length
          });
        }
      } catch (err) {
        console.error("Failed to parse posts data", err);
      }
    }
  }, [id, user, isOwnProfile, profileUser]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      await updateProfile({
        name: profileForm.name,
        username: profileForm.username,
        bio: profileForm.bio,
        avatar: profileForm.avatar
      });
      
      // Update the UI
      setProfileUser(prev => prev ? {
        ...prev,
        name: profileForm.name,
        username: profileForm.username,
        bio: profileForm.bio,
        avatar: profileForm.avatar
      } : null);
      
      setEditDialogOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

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
          <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
          <AvatarFallback>{profileUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">{profileUser.name}</h1>
              <p className="text-muted-foreground">@{profileUser.username}</p>
            </div>
            
            {isOwnProfile ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
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
      
      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-2">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={profileForm.avatar} />
                <AvatarFallback>{profileForm.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Input 
                className="mt-2"
                placeholder="Avatar URL" 
                value={profileForm.avatar}
                onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                className="col-span-3"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">
                Username
              </label>
              <Input
                id="username"
                className="col-span-3"
                value={profileForm.username}
                onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="bio" className="text-right">
                Bio
              </label>
              <Textarea
                id="bio"
                className="col-span-3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
