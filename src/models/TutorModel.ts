import {UserModel} from "./UserModel";
import {Course} from "./CourseModel";

export interface TutorModel extends UserModel {
    course?: Course[];
    review?: Review[];
    responses?: Response[];
    averageResponseTime?: number;
}

export interface Review {
    rating: number;
    remark: string;
    userId: string;
}

export interface Response {
    requestId: string;
    responseTime: ResponseTime;
}

export interface ResponseTime {
    $timestamp: string;
}


