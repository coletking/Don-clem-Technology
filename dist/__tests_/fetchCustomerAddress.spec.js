"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const worker_1 = require("../worker"); // Adjust the path as needed
jest.mock("axios");
jest.mock('csv-writer', () => ({
    createObjectCsvWriter: jest.fn(),
}));
const mockedAxios = axios_1.default;
describe("fetchCustomerAddress", () => {
    it("should fetch the address of a customer by their number", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield (0, worker_1.fetchCustomerAddress)(1);
        expect(result).toEqual(mockAddress);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://clemant_demo.com/address_inventory/1", {
            headers: {
                "X-API-KEY": "ssfdsjfksjdhfgjfgvjdshgvshgkjsdlgvkjsdgjkl",
            },
        });
    }));
    it("should handle a network error", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
        yield expect((0, worker_1.fetchCustomerAddress)(1)).rejects.toThrow("Network Error");
    }));
    it("should handle unexpected response structure", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidResponse = { unexpectedField: "value" };
        mockedAxios.get.mockResolvedValue({ data: invalidResponse });
        yield expect((0, worker_1.fetchCustomerAddress)(1)).resolves.toEqual(invalidResponse);
    }));
    it("should return null or throw an error for an invalid customer number", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidCustomerNumber = -1; // Example of an invalid customer number
        mockedAxios.get.mockRejectedValueOnce(new Error("Invalid customer number"));
        yield expect((0, worker_1.fetchCustomerAddress)(invalidCustomerNumber)).rejects.toThrow("Invalid customer number");
    }));
});
