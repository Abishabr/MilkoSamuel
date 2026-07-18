declare global {
  interface Window {
    cloudinary: any;
  }
}

export function openCloudinaryUpload(
  options: { resourceType: 'image' | 'raw'; acceptedFormats?: string[] },
  onSuccess: (secureUrl: string) => void,
  onError: (message: string) => void
) {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      resourceType: options.resourceType,
      clientAllowedFormats: options.acceptedFormats,
      multiple: false,
    },
    (error: any, result: any) => {
      if (error) {
        onError(error.message ?? 'Upload failed');
        widget.close();
        return;
      }
      if (result?.event === 'success') {
        onSuccess(result.info.secure_url);
        widget.close();
      }
    }
  );
  widget.open();
}

// Props shared by every admin tab component
export interface AdminTabProps {
  showToast: (msg: string) => void;
  showWriteError: (msg: string) => void;
}
