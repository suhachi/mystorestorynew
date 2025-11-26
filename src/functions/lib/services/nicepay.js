"use strict";
/**
 * NicePay Service Helper
 * T-PG-02: NicePay Integration Logic
 */
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicepaySecrets = exports.getNicepayConfig = void 0;
exports.generateSignature = generateSignature;
exports.verifySignature = verifySignature;
exports.approvePayment = approvePayment;
const crypto = __importStar(require("crypto"));
const params_1 = require("firebase-functions/params");
// Define secrets
const nicepayMerchantKey = (0, params_1.defineSecret)('NICEPAY_MERCHANT_KEY');
const nicepayClientKey = (0, params_1.defineSecret)('NICEPAY_CLIENT_KEY');
const nicepayMid = (0, params_1.defineSecret)('NICEPAY_MID');
const getNicepayConfig = () => {
    return {
        merchantKey: nicepayMerchantKey.value(),
        clientKey: nicepayClientKey.value(),
        mid: nicepayMid.value(),
        apiBaseUrl: 'https://sandbox-api.nicepay.co.kr/v1', // Default to sandbox, change for prod
    };
};
exports.getNicepayConfig = getNicepayConfig;
exports.nicepaySecrets = [nicepayMerchantKey, nicepayClientKey, nicepayMid];
/**
 * Generate NicePay Signature
 * signature = hex(sha256(tid + mid + amount + merchantKey))
 */
function generateSignature(tid, mid, amount, merchantKey) {
    const data = `${tid}${mid}${amount}${merchantKey}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}
/**
 * Verify NicePay Signature
 */
function verifySignature(signature, tid, mid, amount, merchantKey) {
    const expected = generateSignature(tid, mid, amount, merchantKey);
    return signature === expected;
}
/**
 * Approve Payment (Server-to-Server)
 */
async function approvePayment(tid, amount, orderId) {
    const config = (0, exports.getNicepayConfig)();
    const signature = generateSignature(tid, config.mid, amount, config.merchantKey);
    const response = await fetch(`${config.apiBaseUrl}/payments/${tid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(config.clientKey + ':').toString('base64')}`
        },
        body: JSON.stringify({
            amount,
            orderId,
            SignData: signature,
            EdiDate: new Date().toISOString()
        })
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`NicePay API Error: ${response.status} ${errorBody}`);
    }
    return await response.json();
}
//# sourceMappingURL=nicepay.js.map