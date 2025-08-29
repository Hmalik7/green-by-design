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

    async getServices() {
        return;
    };

    async getServiceById(id) {
        return;
    };

    async createService() {
        return;
    };

    async updateServiceById(id) {
        return;
    };

    async deleteServiceById(id) {
        return;
    };

    async getUsageById(id) {
        return;
    };
}