import axios from "axios";
import {
  fetchCustomerNumbers,
} from "../worker"; // Adjust the path as needed

jest.mock("axios");

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchCustomerNumbers", () => {
  const BASE_URL = "https://clemant_demo.com"; // Define the base URL if needed
  const API_KEY = "ssfdsjfksjdhfgjfgvjdshgvshgkjsdlgvkjsdgjkl"; // Define the API key if needed
  it("should fetch the total number of customers", async () => {
    mockedAxios.get.mockResolvedValue({ data: 400 });

    const result = await fetchCustomerNumbers();
    expect(result).toBe(400);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${BASE_URL}/customer_numbers`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );
  });

  it("should handle errors when the API call fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchCustomerNumbers()).rejects.toThrow("Network Error");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${BASE_URL}/customer_numbers`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );
  });

  it("should handle invalid response data", async () => {
    mockedAxios.get.mockResolvedValue({ data: null }); // Simulating an invalid response

    await expect(fetchCustomerNumbers()).rejects.toThrow("Unexpected response structure");
  });

  it("should handle unexpected response structure", async () => {
    mockedAxios.get.mockResolvedValue({}); // Simulating an unexpected structure

    await expect(fetchCustomerNumbers()).rejects.toThrow("Unexpected response structure");
  });

  it("should handle unexpected API response codes", async () => {
    mockedAxios.get.mockRejectedValue({ response: { data: { message: "Server Error" }, status: 500 } }); // Simulating a server error

    await expect(fetchCustomerNumbers()).rejects.toThrow("Server Error");
  });
});
