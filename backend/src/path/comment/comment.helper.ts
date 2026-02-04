import { formatUser } from "../../utils/formats.js";

export const formatComment = (comment: any) => {
    const { author, ...rest } = comment;

    return {
        ...rest,
        author: author? formatUser(author): null
    }
}