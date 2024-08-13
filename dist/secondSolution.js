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
const axios_1 = __importDefault(require("axios"));
const csv_writer_1 = require("csv-writer");
const path = __importStar(require("path"));
const API_KEY = 'ssfdsjfksjdhfgjfgvjdshgvshgkjsdlgvkjsdgjkl';
const BASE_URL = 'https://clemant_demo.com';
function fetchCustomerNumbers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${BASE_URL}/customer_numbers`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        return response.data;
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
            const address = yield fetchCustomerAddress(i);
            if (cleanAndValidateAddress(address)) {
                customerAddresses.push(address);
            }
        }
        return customerAddresses;
    });
}
function writeAddressesToCSV(addresses) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: './customer_addresses.csv',
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
        const filePath = path.resolve('./customer_addresses.csv');
        console.log(`CSV file written to: ${filePath}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const addresses = yield retrieveAllAddresses();
        yield writeAddressesToCSV(addresses);
        console.table(addresses);
    });
}
main().catch(err => console.error(err));
