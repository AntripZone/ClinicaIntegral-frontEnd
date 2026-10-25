import { useApi } from "@/hooks/useApi";
import type { MedicoApi } from "@/types/api";

export function useMedicos() {
  const { data, cargando } = useApi<MedicoApi[]>("/medicos");
  return { medicos: data ?? [], cargando };
}
