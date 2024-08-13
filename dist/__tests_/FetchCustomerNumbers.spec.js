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
describe("fetchCustomerNumbers", () => {
    const BASE_URL = "https://clemant_demo.com"; // Define the base URL if needed
    const API_KEY = "ssfdsjfksjdhfgjfgvjdshgvshgkjsdlgvkjsdgjkl"; // Define the API key if needed
    it("should fetch the total number of customers", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValue({ data: 400 });
        const result = yield (0, worker_1.fetchCustomerNumbers)();
        expect(result).toBe(400);
        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/customer_numbers`, {
            headers: {
                "X-API-KEY": API_KEY,
            },
        });
    }));
    it("should handle errors when the API call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValue(new Error("Network Error"));
        yield expect((0, worker_1.fetchCustomerNumbers)()).rejects.toThrow("Network Error");
        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/customer_numbers`, {
            headers: {
                "X-API-KEY": API_KEY,
            },
        });
    }));
    it("should handle invalid response data", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValue({ data: null }); // Simulating an invalid response
        yield expect((0, worker_1.fetchCustomerNumbers)()).rejects.toThrow("Unexpected response structure");
    }));
    it("should handle unexpected response structure", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValue({}); // Simulating an unexpected structure
        yield expect((0, worker_1.fetchCustomerNumbers)()).rejects.toThrow("Unexpected response structure");
    }));
    it("should handle unexpected API response codes", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValue({ response: { data: { message: "Server Error" }, status: 500 } }); // Simulating a server error
        yield expect((0, worker_1.fetchCustomerNumbers)()).rejects.toThrow("Server Error");
    }));
});
