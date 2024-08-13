import axios from "axios";
import {
  retrieveAllAddresses,
} from "../worker"; // Adjust the path as needed

jest.mock("axios");
jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe("retrieveAllAddresses", () => {
    it("should retrieve and return all customer addresses", async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.endsWith("/customer_numbers")) {
          return Promise.resolve({ data: 2 });
        } else if (url.endsWith("/address_inventory/1")) {
          return Promise.resolve({
            data: {
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
          });
        } else if (url.endsWith("/address_inventory/2")) {
          return Promise.resolve({
            data: {
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
          });
        }
        return Promise.reject(new Error("Not Found"));
      });
  
      const result = await retrieveAllAddresses();
      expect(result).toHaveLength(2);
      expect(result).toEqual([
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
      ]);
    });
  
  
  
    it("should return an empty array if no addresses are retrieved", async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.endsWith("/customer_numbers")) {
          return Promise.resolve({ data: 0 });
        }
        return Promise.reject(new Error("Not Found"));
      });
  
      const result = await retrieveAllAddresses();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  
    it("should only include valid addresses", async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.endsWith("/customer_numbers")) {
          return Promise.resolve({ data: 2 });
        } else if (url.endsWith("/address_inventory/1")) {
          return Promise.resolve({
            data: {
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
          });
        } else if (url.endsWith("/address_inventory/2")) {
          return Promise.resolve({
            data: {
              id: 2,
              first_name: "",
              last_name: "Doe",
              street: "",
              postcode: "67890",
              state: "NY",
              country: "USA",
              lat: 40.7128,
              lon: -74.006,
            },
          });
        }
        return Promise.reject(new Error("Not Found"));
      });
  
      const result = await retrieveAllAddresses();
      expect(result).toHaveLength(1);
      expect(result).toEqual([
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
      ]);
    });
  });
  

 



