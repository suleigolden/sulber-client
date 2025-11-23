

export const useSignature = (signature?: string): string | undefined => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!signature) return;
    
    // Convert ASCII string to base64
    const base64Signature = btoa(signature);
    return `${baseUrl}/files/${base64Signature}`;
  };
  

