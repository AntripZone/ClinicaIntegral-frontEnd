export function urlArchivo(
  ruta: string | null | undefined,
): string | undefined {
  if (!ruta) return undefined;
  return `${import.meta.env.VITE_API_URL}${ruta}`;
}
