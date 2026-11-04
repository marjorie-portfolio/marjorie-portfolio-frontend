type ExpirableContent = {
  expires_at: string | null;
  expiresAt?: string | null;
};

export function getExpiresAt(content: ExpirableContent): string | null {
  return content.expires_at ?? content.expiresAt ?? null;
}

export function isTemporary(content: ExpirableContent): boolean {
  return getExpiresAt(content) !== null;
}

export function isDescriptionEmpty(value: string): boolean {
  return value.replace(/<[^>]*>/g, "").trim().length === 0;
}

export function rememberSectionExpiry(
  sectionId: number,
  expiresAt: string | null,
): void {
  if (!expiresAt || typeof window === "undefined") return;
  window.localStorage.setItem(`section-expiry-${sectionId}`, expiresAt);
}

export function getRememberedSectionExpiry(sectionId: number): string | null {
  if (typeof window === "undefined") return null;
  const expiresAt = window.localStorage.getItem(`section-expiry-${sectionId}`);
  if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) return null;
  return expiresAt;
}
