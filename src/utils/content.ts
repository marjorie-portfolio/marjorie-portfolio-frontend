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
