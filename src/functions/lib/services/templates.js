"use strict";
/**
 * Template Rendering Service
 * T14-11: Server-side Mustache rendering
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
exports.renderTemplateServer = renderTemplateServer;
const firestore_1 = require("firebase-admin/firestore");
const Mustache = __importStar(require("mustache"));
async function renderTemplateServer(params) {
    try {
        const db = (0, firestore_1.getFirestore)();
        const templateRef = db.doc(`stores/${params.storeId}/notifyTemplates/${params.templateId}`);
        const templateDoc = await templateRef.get();
        if (!templateDoc.exists) {
            // Try fallback to default template
            const defaultTemplateRef = db.doc(`stores/${params.storeId}/notifyTemplates/default_ko-KR`);
            const defaultDoc = await defaultTemplateRef.get();
            if (!defaultDoc.exists) {
                return {
                    success: false,
                    error: 'Template not found and no default template available'
                };
            }
            const defaultTemplate = defaultDoc.data();
            return renderTemplate(defaultTemplate, params.data);
        }
        const template = templateDoc.data();
        if (template?.status !== 'published') {
            return { success: false, error: 'Template is not published' };
        }
        return renderTemplate(template, params.data);
    }
    catch (error) {
        console.error('[Templates] Render failed:', error);
        return { success: false, error: error.message };
    }
}
function renderTemplate(template, data) {
    try {
        // TODO(F-ERR-01): Mustache.escape is readonly, cannot reassign
        // Using default HTML escaping behavior
        // If unescaped output is needed, use {{{triple braces}}} in template
        const subject = template.subject
            ? Mustache.render(template.subject, data)
            : '';
        const body = Mustache.render(template.body, data);
        return {
            success: true,
            subject,
            body
        };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=templates.js.map