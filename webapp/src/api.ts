import axios from "axios";
import { CreateUserDto, LoginDto, OrganizationModel, PriorityChangeDto, StatusChangeDto, TicketDetailModel, TicketModel, UserModel } from "./models/user.model";




const axiosInstance = axios.create({ baseURL: '/api', });
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        if (error.response.error.response.status === 401) {
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    });

export const registerUser = async (data: CreateUserDto): Promise<UserModel> => {
    const response = await axiosInstance.post<CreateUserDto, UserModel>('/user/register', data);


    return response;
};

export const loginUser = async (data: LoginDto): Promise<UserModel> => {
    console.log(data);
    const response = await axiosInstance.post<LoginDto, UserModel>('/auth/login', data);
    return response;
};

export const logoutUser = async (): Promise<void> => {
    await axiosInstance.get('/auth/logout');

};

export const getProfile = async (): Promise<UserModel> => {
    const response = await axiosInstance.get<LoginDto, UserModel>('/auth/profile');
    return response;
};

export const createOrg = async (name: string): Promise<OrganizationModel> => {
    const response = await axiosInstance.post<any, OrganizationModel>('/org/create', { name });
    return response;
}

export const getOrg = async (): Promise<OrganizationModel> => {
    const response = await axiosInstance.get<OrganizationModel>('/org');
    console.log(response.data);
    return response.data;
}


export const getTickets = async (): Promise<TicketModel[]> => {
    const response = await axiosInstance.get<any>('/org/tickets');
    return response.data;
}

export const getThread = async (ticketId: string): Promise<TicketDetailModel> => {
    const response = await axiosInstance.get<any>(`/org/tickets/${ticketId}`);
    return response.data;
}

export const triggerWorkflow = async (): Promise<string> => {
    const response = await axiosInstance.get<string>('/nylas/trigger-workflow');
    console.log(response.data);
    return response.data;
}

export const updateTicketStatus = async (dto: StatusChangeDto): Promise<TicketModel> => {
    const response = await axiosInstance.post<StatusChangeDto, TicketModel>('/org/tickets/status', dto);
    return response;
}

export const updateTicketPriority = async (dto: PriorityChangeDto): Promise<TicketModel> => {
    const response = await axiosInstance.post<PriorityChangeDto, TicketModel>('/org/tickets/priority', dto);
    return response;
}