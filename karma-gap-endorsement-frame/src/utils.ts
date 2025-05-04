function extractIdFromLink(link: string): string | null {
    try {
      const url = new URL(link);
      const parts = url.pathname.split("/");
      return parts[parts.length - 1] || null;
    } catch (error) {
      return null;
    }
  }
  