import { UUID } from 'crypto';
import { db } from '../db/db.ts'

export type CloudServiceData = {
    cloudServicesId: UUID 
    companyCloudName: string
    cloudProvideType: string
    cloudProviderAccountId: number
    cloudProviderAccountName: string
    cloudServiceType: string
    cloudProviderRegion: string
    cloudServiceInstanceFamily: string
    numberOfCloudServiceInstances: number
    metricForCloudServiceUsage: string
    createdAt: Date
}

export class CloudServicesModel {

    /**
     * Retrieves all services.
     * @returns {CloudServiceData[] | null} [Array of all cloud services, null on error]
     */
    async getServices() {
        return;
    };

    /**
     * Retrieves a service based on its id.
     * @param {UUID} serviceId [User Id] 
     * @returns {CloudServiceData | null} [Service data, null on error]
     */
    async getServiceById(serviceId: UUID) {
        return;
    };

    /**
     * Creates a service.
     * @param {CloudServiceData} serviceData [Service Data] 
     * @returns {Object | null} [Created service record]
     */
    async createService(serviceData: CloudServiceData) {
        return;
    };

    /**
     * Update a service based on data including an id.
     * @param {CloudServiceData} serviceData [Service Data with id]
     * @returns {CloudServiceData | null} [Updated service data, null on error]
     */
    async updateServiceById(serviceData: CloudServiceData) {
        return;
    };

    /**
     * Delete a service based on its id.
     * @param {UUID} serviceId [Service Id] 
     * @returns 
     */
    async deleteServiceById(serviceId: UUID) {
        return;
    };

    /**
     * Retrieve the usage of a service based on its id.
     * @param {UUID} serviceId [Service Id]
     * @returns
     */
    async getUsageById(serviceId: UUID) {
        return;
    };
}