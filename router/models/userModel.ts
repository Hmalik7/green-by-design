import { UUID } from 'crypto';
import { db } from '../db/db.ts'

export type UserData = {
    userID: UUID;
    userCompany: string;
    userEmailId: string;
    userPersona: string;
    userRole: UUID;
    createdAt: Date;
    modifiedAt: Date;
    modifiedBy: UUID;
};

export class UserModel {

    async create(data: UserData) {
        return;
    };

    async getUserById(userId: UUID) {
        return;
    };

    async getUserServices(userId: UUID) {
        return;
    };

    async getUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    async createUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    async deleteUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    async getPrivilegesById(userId: UUID) {
        return;
    };
}