declare global {
  interface Window {
    cloudinary: any;
  }
}

/** Extra metadata returned alongside a successful upload. */
export interface UploadResult {
  url: string;
  width?: number;
  height?: number;
  resourceType?: string;
}

export function openCloudinaryUpload(
  options: { resourceType: 'image' | 'video' | 'raw' | 'auto'; acceptedFormats?: string[] },
  onSuccess: (secureUrl: string, meta?: UploadResult) => void,
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
        const info = result.info ?? {};
        onSuccess(info.secure_url, {
          url: info.secure_url,
          width: info.width,
          height: info.height,
          resourceType: info.resource_type,
        });
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
