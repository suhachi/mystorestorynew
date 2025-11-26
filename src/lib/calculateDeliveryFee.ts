/**
 * Haversine Distance Calculator & Delivery Fee Logic
 * T-DEL-01: Distance-based delivery fee calculation
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export interface DeliverySettings {
  baseFee: number; // 기본 배달비
  freeThreshold: number; // 무료 배달 최소 금액
  extraFeePerKm: number; // km당 추가 요금
  maxDistance: number; // 최대 배달 거리 (km)
  distanceTiers?: Array<{
    maxKm: number;
    fee: number;
  }>;
}

export interface DeliveryFeeResult {
  deliveryFee: number;
  distanceKm: number;
  reason: string;
}

/**
 * Calculate delivery fee based on distance and order amount
 */
export function calculateDeliveryFee(
  storeLat: number,
  storeLng: number,
  customerLat: number,
  customerLng: number,
  orderAmount: number,
  settings: DeliverySettings
): DeliveryFeeResult {
  const distance = calculateDistance(storeLat, storeLng, customerLat, customerLng);

  // Check if distance exceeds max
  if (distance > settings.maxDistance) {
    return {
      deliveryFee: -1, // Indicates out of range
      distanceKm: distance,
      reason: `배달 가능 거리(${settings.maxDistance}km)를 초과했습니다.`
    };
  }

  // Check if order qualifies for free delivery
  if (orderAmount >= settings.freeThreshold) {
    return {
      deliveryFee: 0,
      distanceKm: distance,
      reason: `${settings.freeThreshold.toLocaleString()}원 이상 주문으로 무료 배달`
    };
  }

  // Calculate fee based on distance tiers if available
  if (settings.distanceTiers && settings.distanceTiers.length > 0) {
    for (const tier of settings.distanceTiers) {
      if (distance <= tier.maxKm) {
        return {
          deliveryFee: tier.fee,
          distanceKm: distance,
          reason: `${tier.maxKm}km 이내 배달비`
        };
      }
    }
  }

  // Default: base fee + extra per km
  const extraFee = Math.ceil(distance) * settings.extraFeePerKm;
  const totalFee = settings.baseFee + extraFee;

  return {
    deliveryFee: totalFee,
    distanceKm: distance,
    reason: `기본 배달비 ${settings.baseFee}원 + ${Math.ceil(distance)}km × ${settings.extraFeePerKm}원`
  };
}

/**
 * Legacy delivery fee calculation (for rollback)
 * TODO(DEL-INT-01): This function is kept for rollback purposes only.
 * Use calculateDeliveryFee() for new implementations.
 */
export function calculateDeliveryFeeLegacy(orderAmount: number): number {
  return orderAmount >= 20000 ? 0 : 3000;
}
