import { defineAction } from 'astro:actions';
import { number, z } from 'astro:schema';

export const server = {
  numberOfPeople: defineAction({ 
    accept: "form",
    input: z.object({
      numberOfPeople: z.number()
    }),
    handler: async ({ numberOfPeople }) => {
    
    //   return {
    //     numberOfPeople,
    //   };
    }
  })
}