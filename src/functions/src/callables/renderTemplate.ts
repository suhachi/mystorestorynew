/**
 * renderTemplate Callable Function
 * T14-11: Server-side Mustache template rendering
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import * as Mustache from 'mustache';

export const renderTemplate = onCall(
  { region: 'asia-northeast3' },
  async (request) => {
    const { storeId, templateId, data } = request.data;

    if (!storeId || !templateId || !data) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    const db = getFirestore();
    const templateRef = db.doc(`stores/${storeId}/notifyTemplates/${templateId}`);

    try {
      const templateDoc = await templateRef.get();

      if (!templateDoc.exists) {
        throw new HttpsError('not-found', 'Template not found');
      }

      const template = templateDoc.data();

      if (template?.status !== 'published') {
        throw new HttpsError('failed-precondition', 'Template is not published');
      }

      // Disable HTML escaping for Mustache
      Mustache.escape = (text) => text;

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
    } catch (error: any) {
      console.error('[renderTemplate] Failed:', error);
      
      if (error instanceof HttpsError) {
        throw error;
      }
      
      throw new HttpsError('internal', error.message);
    }
  }
);
