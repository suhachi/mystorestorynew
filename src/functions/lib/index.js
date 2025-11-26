"use strict";
/**
 * MyStoreStory Cloud Functions v2
 * T14-06 ~ T14-11: Orders & Notifications System
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
exports.cleanupInactiveTokens = exports.paymentWebhook = exports.onOrderHistoryCreated = exports.processDelayedNotify = exports.retryNotify = exports.renderTemplate = exports.getOrder = exports.createOrder = exports.confirmPayment = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
admin.initializeApp();
// Export all functions
var confirmPayment_1 = require("./callables/confirmPayment");
Object.defineProperty(exports, "confirmPayment", { enumerable: true, get: function () { return confirmPayment_1.confirmPayment; } });
var createOrder_1 = require("./callables/createOrder");
Object.defineProperty(exports, "createOrder", { enumerable: true, get: function () { return createOrder_1.createOrder; } });
var getOrder_1 = require("./callables/getOrder");
Object.defineProperty(exports, "getOrder", { enumerable: true, get: function () { return getOrder_1.getOrder; } });
var renderTemplate_1 = require("./callables/renderTemplate");
Object.defineProperty(exports, "renderTemplate", { enumerable: true, get: function () { return renderTemplate_1.renderTemplate; } });
var retryNotify_1 = require("./callables/retryNotify");
Object.defineProperty(exports, "retryNotify", { enumerable: true, get: function () { return retryNotify_1.retryNotify; } });
var delayedNotify_1 = require("./queues/delayedNotify");
Object.defineProperty(exports, "processDelayedNotify", { enumerable: true, get: function () { return delayedNotify_1.processDelayedNotify; } });
var historyNotify_1 = require("./triggers/historyNotify");
Object.defineProperty(exports, "onOrderHistoryCreated", { enumerable: true, get: function () { return historyNotify_1.onOrderHistoryCreated; } });
var paymentWebhook_1 = require("./triggers/paymentWebhook");
Object.defineProperty(exports, "paymentWebhook", { enumerable: true, get: function () { return paymentWebhook_1.paymentWebhook; } });
var tokenCleanup_1 = require("./triggers/tokenCleanup");
Object.defineProperty(exports, "cleanupInactiveTokens", { enumerable: true, get: function () { return tokenCleanup_1.cleanupInactiveTokens; } });
//# sourceMappingURL=index.js.map