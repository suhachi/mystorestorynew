/**
 * Template Rendering Service
 * T14-11: Server-side Mustache rendering
 */

import { getFirestore } from 'firebase-admin/firestore';
import * as Mustache from 'mustache';

export async function renderTemplateServer(params: {
  storeId: string;
  templateId: string;
  data: Record<string, any>;
}): Promise<{ success: boolean; subject?: string; body?: string; error?: string }> {
  try {
    const db = getFirestore();
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
  } catch (error: any) {
    console.error('[Templates] Render failed:', error);
    return { success: false, error: error.message };
  }
}

function renderTemplate(
  template: any,
  data: Record<string, any>
): { success: boolean; subject?: string; body?: string; error?: string } {
  try {
    // Disable HTML escaping
    Mustache.escape = (text) => text;

    const subject = template.subject 
      ? Mustache.render(template.subject, data) 
      : '';
    const body = Mustache.render(template.body, data);

    return {
      success: true,
      subject,
      body
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
