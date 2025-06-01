import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  // Action to save the number of people
  numberOfPeople: defineAction({ 
    accept: "form",
    input: z.object({
      numberOfPeople: z.number()
    }),
    handler: async (input,context ) => {
      context.session.set('numberOfPeople', input.numberOfPeople);
    }
  }),
  // Action to save the type of VR
  typeOfVr: defineAction({
    accept: "form",
    input: z.object({
      typeOfVr: z.enum(['VR Sans Fil', 'VR'])}),
    handler: async (input, context) => {
      context.session.set('typeOfVr', input.typeOfVr);
    }
  }),
  // Action to save the duration
  duration: defineAction({
    accept: "form",
    input: z.object({
      duration: z.enum(['30', '60'])
    }),
    handler: async (input, context) => {
      context.session.set('duration', input.duration);
    }
  }),
  // Action to save the date
  savedDate: defineAction({
    accept: "form",
    input: z.object({
      date: z.string()
    }),
    handler: async (input, context) => {
      context.session.set('date', input.date);
    }
  }),
  // Action to save time
  saveTime: defineAction({
    accept: "form",
    input: z.object({
      time: z.string()
    }),
  handler: async (input, context) => {
    context.session.set("time", input.time);
  }}),
  // Action to save contact information
  contact: defineAction({
    accept: "form", 
    input: z.object({
      fullName: z.string(),
      email: z.string(),
      phoneNumber: z.string()
    }),
    handler: async (input, context) => {
      context.session.set('fullName', input.fullName);
      context.session.set('email', input.email);
      context.session.set('phoneNumber', input.phoneNumber);
    }
  }),
}