import { toast } from "sonner";
import { debounce } from "./debounce";

export const showToast = debounce(
    (type: string, title: string, message: string) => {
        switch (type) {
            case "MATCH_ACCEPTED":
                toast.success(title, { description: message });
                break;
            case "MATCH_REQUEST":
                toast.info(title, { description: message });
                break;
            default:
                toast(title, { description: message });
        }
    },
    1000 // max 1 toast/sec
);
