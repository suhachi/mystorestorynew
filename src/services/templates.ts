/**
 * Notification Templates Service
 * T14-11: Template management and rendering
 * 
 * Features:
 * - Local preview rendering (Mustache)
 * - Template CRUD operations
 * - Server-side rendering callable (stub)
 */

/**
 * Simple Mustache-style template renderer
 * Replaces {{variable}} with data values
 */
export function renderMustache(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

/**
 * Render template preview locally (client-side)
 */
export function renderPreviewLocally(
  template: { subject?: string; body: string },
  data: Record<string, any>
): { subject?: string; body: string } {
  return {
    subject: template.subject ? renderMustache(template.subject, data) : undefined,
    body: renderMustache(template.body, data)
  };
}

/**
 * Validate template
 */
export function validateTemplate(template: {
  name: string;
  channel: string;
  body: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!template.name || template.name.trim().length === 0) {
    errors.push('템플릿 이름은 필수입니다.');
  }

  if (!template.body || template.body.trim().length === 0) {
    errors.push('메시지 본문은 필수입니다.');
  }

  if (template.body.length > 1000) {
    errors.push('메시지 본문은 1000자를 초과할 수 없습니다.');
  }

  // Check for balanced mustache tags
  const openTags = (template.body.match(/\{\{/g) || []).length;
  const closeTags = (template.body.match(/\}\}/g) || []).length;
  if (openTags !== closeTags) {
    errors.push('Mustache 변수 태그가 올바르지 않습니다 ({{ }}).');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get available template variables
 */
export function getAvailableVariables(): Record<string, string> {
  return {
    storeName: '상점 이름',
    orderNumber: '주문 번호',
    orderStatus: '주문 상태',
    customerName: '고객 이름',
    customerPhone: '고객 전화번호 (마스킹)',
    total: '주문 총액',
    itemCount: '상품 개수',
    createdAt: '주문 생성 시각',
    updatedAt: '주문 업데이트 시각',
    note: '메모/요청사항'
  };
}

/**
 * Server-side template rendering (Cloud Functions v2 callable)
 * This would be implemented in functions/src/templates.render.ts
 * 
 * Example usage:
 * const functions = getFunctions(app, 'asia-northeast3');
 * const renderTemplate = httpsCallable(functions, 'renderTemplate');
 * const result = await renderTemplate({
 *   storeId: 'store_001',
 *   templateId: 'tpl_order_confirmed',
 *   data: { orderNumber: '#123', ... }
 * });
 */
export async function renderTemplateServer(params: {
  storeId: string;
  templateId: string;
  data: Record<string, any>;
}): Promise<{
  success: boolean;
  channel?: string;
  locale?: string;
  subject?: string;
  body?: string;
  warnings?: string[];
  error?: string;
}> {
  try {
    // In production, this would call Cloud Functions v2
    console.log('[Templates] Server-side render (stub):', params);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock response
    return {
      success: true,
      channel: 'fcm',
      locale: 'ko-KR',
      subject: '주문이 접수되었습니다',
      body: `${params.data.storeName}에서 주문 ${params.data.orderNumber}을(를) 확인했습니다.`,
      warnings: []
    };
  } catch (error) {
    console.error('[Templates] Server render failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '템플릿 렌더링 실패'
    };
  }
}

/**
 * Check for length limits and special characters
 */
export function checkMessageConstraints(params: {
  channel: 'fcm' | 'slack';
  subject?: string;
  body: string;
}): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (params.channel === 'fcm') {
    // FCM title limit: 100 chars
    if (params.subject && params.subject.length > 100) {
      warnings.push('FCM 제목은 100자를 권장합니다 (현재: ' + params.subject.length + '자)');
    }

    // FCM body limit: 500 chars recommended
    if (params.body.length > 500) {
      warnings.push('FCM 본문은 500자를 권장합니다 (현재: ' + params.body.length + '자)');
    }
  }

  if (params.channel === 'slack') {
    // Slack message limit: 4000 chars
    if (params.body.length > 4000) {
      warnings.push('Slack 메시지는 4000자를 초과할 수 없습니다.');
    }
  }

  // Check for emoji (informational)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
  if (emojiRegex.test(params.body)) {
    warnings.push('이모지가 포함되어 있습니다. 일부 기기에서 표시되지 않을 수 있습니다.');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}
