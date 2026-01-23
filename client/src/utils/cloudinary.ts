import axios from 'axios';
import { toast } from 'sonner';

export async function uploadToCloudinary(
    url: string,
    formData: FormData
): Promise<string> {
    try {
        const res = await axios.post<{ secure_url: string }>(url, formData);
        return res.data.secure_url;
    } catch (error: any) {
        toast.error(
            error?.response?.data?.error?.message ||
            'Image upload failed'
        );
        throw error;
    }
}
