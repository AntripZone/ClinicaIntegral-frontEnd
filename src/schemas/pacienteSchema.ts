import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  apellido: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  email: z.email("Email inválido").max(150),
  telefono: z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"),
  fechaNacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  direccion: z.string().trim().max(255).optional(),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;
