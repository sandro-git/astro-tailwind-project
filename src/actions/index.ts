import { defineAction } from 'astro:actions';
import { date, string, z } from 'astro:schema';

export const server = {
  numberOfPeople: defineAction({ 
    accept: "form",
    input: z.object({
      numberOfPeople: z.number()
    }),
    handler: async (input,context ) => {
      context.session.set('numberOfPeople', input.numberOfPeople);
    }
  }),
  typeOfVr: defineAction({
    accept: "form",
    input: z.object({
      typeOfVr: z.enum(['VR Sans Fil', 'VR'])}),
    handler: async (input, context) => {
      context.session.set('typeOfVr', input.typeOfVr);
    }
  }),
  duration: defineAction({
    accept: "form",
    input: z.object({
      duration: z.enum(['30', '60'])
    }),
    handler: async (input, context) => {
      context.session.set('duration', input.duration);
    }
  }),
  // date: defineAction({
  //   accept: "form",
  //   input: z.object({
  //     date: string()
  //   }),
  //   handler: async (input, context) => {
  //     context.session.set('date', input.date);
  //   }
  // }),
}