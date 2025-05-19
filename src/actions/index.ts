import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

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
  savedDate: defineAction({
    accept: "form",
    input: z.object({
      date: z.string()
    }),
    handler: async (input, context) => {
      context.session.set('date', input.date);
    }
  }),
  saveTime: defineAction({
    accept: "form",
    input: z.object({
      time: z.string()
    }),
  handler: async (input, context) => {
    context.session.set("time", input.time);
  }}),
  contact: defineAction({
    accept: "form", 
    input: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string()
    }),
    handler: async (input, context) => {
      context.session.set('name', input.name);
      context.session.set('email', input.email);
      context.session.set('phone', input.phone);
    }
  }),
}