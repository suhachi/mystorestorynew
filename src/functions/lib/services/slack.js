"use strict";
/**
 * Slack Webhook Service
 * T14-09: Send Slack notifications with 5s timeout
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSlackMessage = sendSlackMessage;
async function sendSlackMessage(params) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        const response = await fetch(params.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: params.text,
                unfurl_links: false,
                unfurl_media: false
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        console.log('[Slack] Message sent successfully');
        return { success: true };
    }
    catch (error) {
        console.error('[Slack] Send failed:', error);
        if (error.name === 'AbortError') {
            return { success: false, error: 'TIMEOUT_5S' };
        }
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=slack.js.map