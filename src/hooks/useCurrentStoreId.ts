/**
 * Hook to get the current store ID
 * Provides a centralized way to manage store ID across the application
 */

/**
 * Get the current store ID from environment or default
 * This is a non-hook version for use in non-React contexts
 */
export function getDefaultStoreId(): string {
  // 1) Check environment variable first
  const envStoreId = (import.meta as any).env?.VITE_STORE_ID;
  if (envStoreId) return envStoreId;

  // 2) Default fallback
  // In production, this should be replaced with actual store lookup logic
  // (e.g., from URL, user session, or database)
  return "default_store";
}

/**
 * React hook to get the current store ID
 * For now, returns the default store ID from environment or fallback
 *
 * Future enhancements:
 * - Get from user authentication context
 * - Get from URL parameters
 * - Get from multi-store selection
 */
export function useCurrentStoreId(): string {
  // For now, just return the default
  // In the future, this could use React context or other state management
  return getDefaultStoreId();
}
