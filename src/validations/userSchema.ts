import z from 'zod';

export const userSchema = z.object({

    horas: z.string().optional().transform(Number).refine(n => Number.isInteger(n) && n >= 0, {
        message: "Las horas deben ser un número entero positivo",
    }),
    comentarios: z.string().max(100).optional(),
    predico: z.boolean(),
    auxiliar: z.boolean(),
    cursos: z.string().optional().transform(Number)


})