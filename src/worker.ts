import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();


interface Address {
  id: number;
  first_name: string;
  last_name: string;
  street: string;
  postcode: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

export async function fetchCustomerNumbers(): Promise<number> {
    try {
      const response = await axios.get(`${BASE_URL}/customer_numbers`, {
        headers: { 'X-API-KEY': API_KEY }
      });
  
      if (typeof response.data !== "number") {
        throw new Error("Unexpected response structure");
      }
  
      return response.data;
    } catch (error:any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

export async function fetchCustomerAddress(customerNumber: number): Promise<Address> {
  const response = await axios.get(`${BASE_URL}/address_inventory/${customerNumber}`, {
    headers: { 'X-API-KEY': API_KEY }
  });
  return response.data;
}

export function cleanAndValidateAddress(address: Address): boolean {
  const requiredFields = ['id', 'first_name', 'last_name', 'street', 'postcode', 'state', 'country', 'lat', 'lon'];
  return requiredFields.every(field => (address as any)[field] !== undefined && (address as any)[field] !== '');
}

export async function retrieveAllAddresses(): Promise<Address[]> {
    const totalCustomers = await fetchCustomerNumbers();
    const customerAddresses: Address[] = [];
  
    for (let i = 1; i <= totalCustomers; i++) {
      try {
        const address = await fetchCustomerAddress(i);
        if (cleanAndValidateAddress(address)) {
          customerAddresses.push(address);
        }
      } catch (error) {
        console.error(`Failed to retrieve address for customer ${i}:`, error);
      }
    }
  
    return customerAddresses;
  }
  

export async function writeAddressesToCSV(addresses: Address[]): Promise<{ success: boolean; message: string }> {
    try {
      const filePath = path.resolve(__dirname, '../customer_addresses.csv');
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'first_name', title: 'First Name' },
          { id: 'last_name', title: 'Last Name' },
          { id: 'street', title: 'Street' },
          { id: 'postcode', title: 'Postcode' },
          { id: 'state', title: 'State' },
          { id: 'country', title: 'Country' },
          { id: 'lat', title: 'Latitude' },
          { id: 'lon', title: 'Longitude' }
        ]
      });
  
      await csvWriter.writeRecords(addresses);
      const successMessage = `CSV file written to: ${filePath}`;
  
      return { success: true, message: successMessage };
    } catch (error) {
      console.error('Error writing CSV file:', error);
      return { success: false, message: 'Error writing CSV file' };
    }
  }


