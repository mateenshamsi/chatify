  import { useAuthStore } from '@/store/useAuthStore';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import {
    Avatar,
    AvatarFallback,
    AvatarImage
  } from '@/components/ui/avatar';
  import { Camera, User, Mail, Loader2, Save } from 'lucide-react';
  import { useRef, useState } from 'react';
  import toast from 'react-hot-toast';

  function ProfilePage() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Refs for editable fields
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!authUser) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      );
    }

    const handleImageUpdate = async (file: File) => {
      if (!file || file.size === 0) return;

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          setSelectedImage(base64Image);

      

          toast.success('Profile picture updated');
        };
      } catch (err) {
        console.error('Image update failed:', err);
        toast.error('Image update failed');
      }
    };

    const handleSaveProfile = async () => {
  try {
    await updateProfile({
      username: nameRef.current?.value || authUser.username,
      email: emailRef.current?.value || authUser.email,
      profilePicture: selectedImage || authUser.image // ✅ Add this
    });
    toast.success('Profile updated!');
  } catch (err) {
    console.error('Profile update failed:', err);
    toast.error('Failed to update profile');
  }
};


    return (
      <div className="min-h-screen pt-20" style={{ backgroundColor: '#FEFAE0' }}>
        <div className="max-w-2xl mx-auto p-4 py-8">
          <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FEFAE0' }}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center" style={{ color: '#BC6C25' }}>
                Profile
              </CardTitle>
              <CardDescription className="text-center text-lg" style={{ color: '#BC6C25' }}>
                Manage your profile information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={selectedImage || authUser.image || '/avatar.png'}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback
                      className="text-2xl font-semibold"
                      style={{ backgroundColor: '#DDA15E', color: '#BC6C25' }}
                    >
                      {authUser.username
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full shadow-lg border-2"
                    style={{
                      backgroundColor: '#DDA15E',
                      borderColor: '#BC6C25',
                      color: '#FEFAE0'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpdate(file);
                  }}
                  className="hidden"
                />
              </div>

              {/* Editable name/email */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium" style={{ color: '#BC6C25' }}>
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    ref={nameRef}
                    defaultValue={authUser.username}
                    style={{
                      backgroundColor: 'rgba(221, 161, 94, 0.1)',
                      borderColor: '#DDA15E',
                      color: '#BC6C25'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium" style={{ color: '#BC6C25' }}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    ref={emailRef}
                    defaultValue={authUser.email}
                    style={{
                      backgroundColor: 'rgba(221, 161, 94, 0.1)',
                      borderColor: '#DDA15E',
                      color: '#BC6C25'
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isUpdatingProfile}
                  className="gap-2"
                  style={{ backgroundColor: '#BC6C25', color: '#FEFAE0' }}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  export default ProfilePage;
