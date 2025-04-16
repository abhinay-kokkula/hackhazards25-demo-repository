
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  existingImage?: string;
}

const ImageUpload = ({ onImageUploaded, existingImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product_images")
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(data!.path);
      
      // Pass URL to parent
      onImageUploaded(publicUrlData.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
      setPreview(existingImage || null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClear = () => {
    setPreview(null);
    onImageUploaded("");
  };
  
  return (
    <div className="flex flex-col items-center">
      {preview ? (
        <div className="relative w-full h-40 mb-2">
          <img 
            src={preview} 
            alt="Product preview" 
            className="w-full h-full object-cover rounded-md"
          />
          <button 
            onClick={handleClear} 
            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 w-full text-center mb-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop or click to upload
          </p>
        </div>
      )}
      
      <div className="flex justify-center w-full">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          className="relative"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={isUploading}
            accept="image/*"
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
