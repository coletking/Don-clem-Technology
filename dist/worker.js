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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomerNumbers = fetchCustomerNumbers;
exports.fetchCustomerAddress = fetchCustomerAddress;
exports.cleanAndValidateAddress = cleanAndValidateAddress;
exports.retrieveAllAddresses = retrieveAllAddresses;
exports.writeAddressesToCSV = writeAddressesToCSV;
const axios_1 = __importDefault(require("axios"));
const csv_writer_1 = require("csv-writer");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
function fetchCustomerNumbers() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield axios_1.default.get(`${BASE_URL}/customer_numbers`, {
                headers: { 'X-API-KEY': API_KEY }
            });
            if (typeof response.data !== "number") {
                throw new Error("Unexpected response structure");
            }
            return response.data;
        }
        catch (error) {
            throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message);
        }
    });
}
function fetchCustomerAddress(customerNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${BASE_URL}/address_inventory/${customerNumber}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        return response.data;
    });
}
function cleanAndValidateAddress(address) {
    const requiredFields = ['id', 'first_name', 'last_name', 'street', 'postcode', 'state', 'country', 'lat', 'lon'];
    return requiredFields.every(field => address[field] !== undefined && address[field] !== '');
}
function retrieveAllAddresses() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalCustomers = yield fetchCustomerNumbers();
        const customerAddresses = [];
        for (let i = 1; i <= totalCustomers; i++) {
            try {
                const address = yield fetchCustomerAddress(i);
                if (cleanAndValidateAddress(address)) {
                    customerAddresses.push(address);
                }
            }
            catch (error) {
                console.error(`Failed to retrieve address for customer ${i}:`, error);
            }
        }
        return customerAddresses;
    });
}
function writeAddressesToCSV(addresses) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path.resolve(__dirname, '../customer_addresses.csv');
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
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
            yield csvWriter.writeRecords(addresses);
            const successMessage = `CSV file written to: ${filePath}`;
            return { success: true, message: successMessage };
        }
        catch (error) {
            console.error('Error writing CSV file:', error);
            return { success: false, message: 'Error writing CSV file' };
        }
    });
}
