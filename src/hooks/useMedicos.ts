import { useEffect, useState } from "react";
import type { Medico } from "@/types/medico";

const medicosSimulados: Medico[] = [
  { id: "m1", nombre: "Dra. Laura Méndez", especialidad: "Cardiología" },
  { id: "m2", nombre: "Dr. Jorge Salas", especialidad: "Pediatría" },
  { id: "m3", nombre: "Dra. Paula Ríos", especialidad: "Dermatología" },
  { id: "m4", nombre: "Dr. Andrés Vega", especialidad: "Medicina General" },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 800);

    return () => clearTimeout(timer); // cancela el timer si el componente se desmonta antes
  }, []);

  return { medicos, cargando };
}
