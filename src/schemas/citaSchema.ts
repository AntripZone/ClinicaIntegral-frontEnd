import { z } from "zod";

export function hoyISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export const citaSchema = z.object({
  pacienteId: z.string().min(1, "Selecciona un paciente"),

  medicoId: z.string().min(1, "Selecciona un médico"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)")
    .refine((fecha) => fecha >= hoyISO(), "La fecha no puede ser pasada"),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Hora inválida (HH:MM, de 00:00 a 23:59)",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar 500 caracteres"),

  urgencia: z.enum(["baja", "media", "alta", "critica"], {
    error: "Selecciona un nivel de urgencia",
  }),
});

export type CitaFormData = z.infer<typeof citaSchema>;
