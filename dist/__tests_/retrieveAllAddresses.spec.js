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
describe("retrieveAllAddresses", () => {
    it("should retrieve and return all customer addresses", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => {
            if (url.endsWith("/customer_numbers")) {
                return Promise.resolve({ data: 2 });
            }
            else if (url.endsWith("/address_inventory/1")) {
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
            }
            else if (url.endsWith("/address_inventory/2")) {
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
        const result = yield (0, worker_1.retrieveAllAddresses)();
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
    }));
    it("should return an empty array if no addresses are retrieved", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => {
            if (url.endsWith("/customer_numbers")) {
                return Promise.resolve({ data: 0 });
            }
            return Promise.reject(new Error("Not Found"));
        });
        const result = yield (0, worker_1.retrieveAllAddresses)();
        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    }));
    it("should only include valid addresses", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => {
            if (url.endsWith("/customer_numbers")) {
                return Promise.resolve({ data: 2 });
            }
            else if (url.endsWith("/address_inventory/1")) {
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
            }
            else if (url.endsWith("/address_inventory/2")) {
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
        const result = yield (0, worker_1.retrieveAllAddresses)();
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
    }));
});
