export function setCookie(name: string, value: string, days: number) {
   const expires = new Date();
   expires.setDate(expires.getDate() + days);
   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name: string): string | null {
   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
   return match ? decodeURIComponent(match[2]) : null;
}
