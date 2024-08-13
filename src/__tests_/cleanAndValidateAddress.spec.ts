
import {
  cleanAndValidateAddress,
} from "../worker"; // Adjust the path as needed

jest.mock("axios");

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));
describe("cleanAndValidateAddress", () => {
    it("should return true for a valid address", () => {
      const validAddress = {
        id: 76767,
        first_name: "John",
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      };
  
      expect(cleanAndValidateAddress(validAddress)).toBe(true);
    });
  
    it("should return false if any required field is missing or empty", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "",
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      };
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the id field is missing", () => {
      const invalidAddress = {
        first_name: "John",
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      } as any;
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the first_name field is missing", () => {
      const invalidAddress = {
        id: 76767,
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      } as any;
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the last_name field is empty", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "John",
        last_name: "",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      };
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the street field is missing", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "John",
        last_name: "Doe",
        postcode: "12345",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      } as any;
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the postcode field is empty", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "John",
        last_name: "Doe",
        street: "Main St",
        postcode: "",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      };
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the state field is undefined", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "John",
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        country: "USA",
        lat: 37.7749,
        lon: -122.4194,
      } as any;
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
    it("should return false if the country field is empty", () => {
      const invalidAddress = {
        id: 76767,
        first_name: "John",
        last_name: "Doe",
        street: "Main St",
        postcode: "12345",
        state: "CA",
        country: "",
        lat: 37.7749,
        lon: -122.4194,
      } as any;
  
      expect(cleanAndValidateAddress(invalidAddress)).toBe(false);
    });
  
  
  
  });
  


