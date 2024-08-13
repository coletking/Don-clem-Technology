"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const worker_1 = require("../worker"); // Adjust the path as needed
jest.mock("axios");
const csv_writer_1 = require("csv-writer");
jest.mock('csv-writer', () => ({
    createObjectCsvWriter: jest.fn(),
}));
describe("writeAddressesToCSV", () => {
    it("should return true and a success message when the CSV file is written successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        csv_writer_1.createObjectCsvWriter.mockReturnValue({
            writeRecords: mockWriteRecords,
        });
        const loc = path.resolve(__dirname, "../../customer_addresses.csv");
        const result = yield (0, worker_1.writeAddressesToCSV)(addresses);
        // Assertions
        expect(csv_writer_1.createObjectCsvWriter).toHaveBeenCalledWith({
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
    }));
    it("should handle an empty array of addresses and still return success", () => __awaiter(void 0, void 0, void 0, function* () {
        const addresses = [];
        const mockWriteRecords = jest.fn();
        csv_writer_1.createObjectCsvWriter.mockReturnValue({
            writeRecords: mockWriteRecords,
        });
        const loc = path.resolve(__dirname, "../../customer_addresses.csv");
        const result = yield (0, worker_1.writeAddressesToCSV)(addresses);
        // Assertions
        expect(csv_writer_1.createObjectCsvWriter).toHaveBeenCalledWith({
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
    }));
    it("should correctly resolve the file path based on the current directory", () => __awaiter(void 0, void 0, void 0, function* () {
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
        csv_writer_1.createObjectCsvWriter.mockReturnValue({
            writeRecords: mockWriteRecords,
        });
        const loc = path.resolve(__dirname, "../../customer_addresses.csv");
        const result = yield (0, worker_1.writeAddressesToCSV)(addresses);
        // Assertions
        expect(csv_writer_1.createObjectCsvWriter).toHaveBeenCalledWith({
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
    }));
});
