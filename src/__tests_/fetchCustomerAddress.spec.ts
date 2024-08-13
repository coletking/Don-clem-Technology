import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import {
  fetchCustomerNumbers,
  fetchCustomerAddress,
  cleanAndValidateAddress,
  retrieveAllAddresses,
  writeAddressesToCSV,
} from "../worker"; // Adjust the path as needed

jest.mock("axios");
import { createObjectCsvWriter } from 'csv-writer';

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe("fetchCustomerAddress", () => {
  it("should fetch the address of a customer by their number", async () => {
    const mockAddress = {
      id: 76767,
      first_name: "John",
      last_name: "Doe",
      street: "my street name",
      postcode: "b76345",
      state: "London",
      country: "United Kingdom",
      lat: 38.8951,
      lon: -77.0364,
    };

    mockedAxios.get.mockResolvedValue({ data: mockAddress });

    const result = await fetchCustomerAddress(1);
    expect(result).toEqual(mockAddress);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://clemant_demo.com/address_inventory/1",
      {
        headers: {
          "X-API-KEY": "ssfdsjfksjdhfgjfgvjdshgvshgkjsdlgvkjsdgjkl",
        },
      }
    );
  });

  it("should handle a network error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchCustomerAddress(1)).rejects.toThrow("Network Error");
  });

  it("should handle unexpected response structure", async () => {
    const invalidResponse = { unexpectedField: "value" };
    mockedAxios.get.mockResolvedValue({ data: invalidResponse });

    await expect(fetchCustomerAddress(1)).resolves.toEqual(invalidResponse);
  });

  it("should return null or throw an error for an invalid customer number", async () => {
    const invalidCustomerNumber = -1; // Example of an invalid customer number
    mockedAxios.get.mockRejectedValueOnce(new Error("Invalid customer number"));

    await expect(fetchCustomerAddress(invalidCustomerNumber)).rejects.toThrow("Invalid customer number");
  });
});


