"use strict";
/**
 * renderTemplate Callable Function
 * T14-11: Server-side Mustache template rendering
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
exports.renderTemplate = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const Mustache = __importStar(require("mustache"));
exports.renderTemplate = (0, https_1.onCall)({ region: 'asia-northeast3' }, async (request) => {
    const { storeId, templateId, data } = request.data;
    if (!storeId || !templateId || !data) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required fields');
    }
    const db = (0, firestore_1.getFirestore)();
    const templateRef = db.doc(`stores/${storeId}/notifyTemplates/${templateId}`);
    try {
        const templateDoc = await templateRef.get();
        if (!templateDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Template not found');
        }
        const template = templateDoc.data();
        if (template?.status !== 'published') {
            throw new https_1.HttpsError('failed-precondition', 'Template is not published');
        }
        // TODO(F-ERR-01): Mustache.escape is readonly, cannot reassign
        // Using default HTML escaping behavior
        // If unescaped output is needed, use {{{triple braces}}} in template
        // Render subject and body
        const subject = template.subject
            ? Mustache.render(template.subject, data)
            : '';
        const body = Mustache.render(template.body, data);
        return {
            success: true,
            subject,
            body,
            channel: template.channel,
            locale: template.locale
        };
    }
    catch (error) {
        console.error('[renderTemplate] Failed:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=renderTemplate.js.map