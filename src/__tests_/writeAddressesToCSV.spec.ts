
import * as path from "path";
import {
  writeAddressesToCSV,
} from "../worker"; // Adjust the path as needed

jest.mock("axios");
import { createObjectCsvWriter } from 'csv-writer';

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));

describe("writeAddressesToCSV", () => {
    it("should return true and a success message when the CSV file is written successfully", async () => {
      const addresses = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          street: "Main St",
          postcode: "12345",
          state: "CA",
          country: "USA",
          lat: 37.7749,
          lon: -122.4194,
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Doe",
          street: "Second St",
          postcode: "67890",
          state: "NY",
          country: "USA",
          lat: 40.7128,
          lon: -74.006,
        },
      ];
  
      const mockWriteRecords = jest.fn();
      (createObjectCsvWriter as jest.Mock).mockReturnValue({
        writeRecords: mockWriteRecords,
      });
  
      const loc = path.resolve(__dirname, "../../customer_addresses.csv");
  
      const result = await writeAddressesToCSV(addresses);
  
      // Assertions
      expect(createObjectCsvWriter).toHaveBeenCalledWith({
        path: loc,
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
        ],
      });
      expect(mockWriteRecords).toHaveBeenCalledWith(addresses);
      expect(result.success).toBe(true);
      expect(result.message).toBe(`CSV file written to: ${loc}`);
    });
  

  
    it("should handle an empty array of addresses and still return success", async () => {
      const addresses: any[] = [];
  
      const mockWriteRecords = jest.fn();
      (createObjectCsvWriter as jest.Mock).mockReturnValue({
        writeRecords: mockWriteRecords,
      });
  
      const loc = path.resolve(__dirname, "../../customer_addresses.csv");
  
      const result = await writeAddressesToCSV(addresses);
  
      // Assertions
      expect(createObjectCsvWriter).toHaveBeenCalledWith({
        path: loc,
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
        ],
      });
      expect(mockWriteRecords).toHaveBeenCalledWith(addresses);
      expect(result.success).toBe(true);
      expect(result.message).toBe(`CSV file written to: ${loc}`);
    });
  
    it("should correctly resolve the file path based on the current directory", async () => {
      const addresses = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          street: "Main St",
          postcode: "12345",
          state: "CA",
          country: "USA",
          lat: 37.7749,
          lon: -122.4194,
        }
      ];
  
      const mockWriteRecords = jest.fn();
      (createObjectCsvWriter as jest.Mock).mockReturnValue({
        writeRecords: mockWriteRecords,
      });
  
      const loc = path.resolve(__dirname, "../../customer_addresses.csv");
  
      const result = await writeAddressesToCSV(addresses);
  
      // Assertions
      expect(createObjectCsvWriter).toHaveBeenCalledWith({
        path: loc,
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
        ],
      });
      expect(mockWriteRecords).toHaveBeenCalledWith(addresses);
      expect(result.success).toBe(true);
      expect(result.message).toBe(`CSV file written to: ${loc}`);
    });
  });
  
