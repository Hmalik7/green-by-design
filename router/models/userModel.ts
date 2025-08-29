import { UUID } from 'crypto';
import { db } from '../db/db.ts'
import { CloudServiceData } from './cloudServicesModel.ts';

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

    /**
     * Creates a user instance.
     * @param {UserData} userData [User data]
     * @returns {Object | null} [Created user record]
     */
    async create(userData: UserData) {
        return;
    };

    /**
     * Retrieves a user based on id.
     * @param {UUID} userId [User Id]
     * @returns {UserData | null} [User data, null on error]
     */
    async getUserById(userId: UUID) {
        return;
    };

    /**
     * Retrieves a user's services based on their id.
     * @param {UUID} userId [User Id] 
     * @returns {CloudServiceData[] | null} [Array of service data, null on error]
     */
    async getUserServices(userId: UUID) {
        return;
    };

    /**
     * Retreives a service on a user based on both of their ids.
     * @param {UUID} userId [User Id] 
     * @param {UUID} serviceId [Service Id]
     * @returns {CloudServiceData | null} [Service data, null on error]
     */
    async getUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    /**
     * Assign a service to a user based on their ids.
     * @param {UUID} userId [User Id]
     * @param {UUID} serviceId [Service Id]
     * @returns {CloudServiceData | null} [Service data, null on error]
     */
    async assignUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    /**
     * Removes a service from a user based on their ids.
     * @param {UUID} userId [User Id]
     * @param {UUID} serviceId [Service Id] 
     * @returns {CloudServiceData | null} [Service data from the removed service, null on error]
     */
    async removeUserServiceByIds(userId: UUID, serviceId: UUID) {
        return;
    };

    /**
     * Retrieves a user's privileges based on their id.
     * @param {UUID} userId [User Id] 
     * @returns
     */
    async getPrivilegesById(userId: UUID) {
        return;
    };
}