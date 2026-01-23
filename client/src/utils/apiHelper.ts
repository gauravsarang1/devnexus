import { AxiosResponse } from 'axios';
import { BaseApiResponse } from './apiResponse';

export function unwrap<T>(res: AxiosResponse<BaseApiResponse<T>>): T {
    return res.data.data;
}
