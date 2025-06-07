import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, Reservations, Users } from 'astro:db';
import { sendConfirmationEmail } from '../lib/emailService';

export const server = {
  // Action to save the number of people
  numberOfPeople: defineAction({ 
    accept: "form",
    input: z.object({
      numberOfPeople: z.number()
    }),
    handler: async (input, context) => {
      context.session.set('numberOfPeople', input.numberOfPeople);
    }
  }),

  // Action to save the type of VR
  typeOfVr: defineAction({
    accept: "form",
    input: z.object({
      typeOfVr: z.enum(['VR Sans Fil', 'VR'])
    }),
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
    }
  }),

  // Action to save contact information and finalize reservation
  contact: defineAction({
    accept: "form", 
    input: z.object({
      fullName: z.string(),
      email: z.string(),
      phoneNumber: z.string()
    }),
    handler: async (input, context) => {
      try {
        // Sauvegarder les infos de contact en session
        context.session.set('fullName', input.fullName);
        context.session.set('email', input.email);
        context.session.set('phoneNumber', input.phoneNumber);

        // Récupérer toutes les données de la session pour finaliser
        const numberOfPeople = await context.session.get('numberOfPeople');
        const typeOfVr = await context.session.get('typeOfVr');
        const duration = await context.session.get('duration');
        const date = await context.session.get('date');
        const time = await context.session.get('time');

        // Validation des données
        if (!numberOfPeople || !typeOfVr || !duration || !date || !time) {
          throw new Error('Données de réservation incomplètes');
        }

        // Créer la date et heure complète
        const [hours, minutes] = time.split(':');
        const reservationDateTime = new Date(date);
        reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Vérifier si l'utilisateur existe déjà
        // Solution de contournement : récupérer tous les utilisateurs et filtrer côté JS
        const allUsers = await db.select().from(Users);
        const existingUser = allUsers.find(user => user.email === input.email) || null;

        let userId;
        if (existingUser) {
          userId = existingUser.id;
        } else {
          // Créer un nouvel utilisateur
          const newUser = await db.insert(Users).values({
            fullName: input.fullName,
            email: input.email,
            phoneNumber: input.phoneNumber,
            createdAt: new Date()
          }).returning({ id: Users.id });
          userId = newUser[0].id;
        }

        // Créer la réservation
        const reservation = await db.insert(Reservations).values({
          numberOfPeople: parseInt(numberOfPeople),
          vrType: typeOfVr,
          dateTime: reservationDateTime,
          duration: parseInt(duration),
          fullName: input.fullName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          createdAt: new Date()
        }).returning();

        // Calculer le prix total
        const price30 = 18;
        const price60 = 29;
        const peopleCount = parseInt(numberOfPeople);
        let totalPrice: string;
        
        if (duration === '30') {
          totalPrice = (price30 * peopleCount).toFixed(2);
        } else if (duration === '60') {
          if (peopleCount <= 2) {
            totalPrice = (price60 * peopleCount).toFixed(2);
          } else if (peopleCount <= 4) {
            totalPrice = ((price60 - 2) * peopleCount).toFixed(2);
          } else if (peopleCount <= 6) {
            totalPrice = ((price60 - 4) * peopleCount).toFixed(2);
          } else {
            totalPrice = '0';
          }
        } else {
          totalPrice = '0';
        }

        // Envoyer l'email de confirmation
        const emailResult = await sendConfirmationEmail({
          email: input.email,
          fullName: input.fullName,
          reservationNumber: `R${reservation[0].id.toString().padStart(6, '0')}`,
          numberOfPeople: parseInt(numberOfPeople),
          vrType: typeOfVr,
          duration: duration,
          dateTime: reservationDateTime,
          totalPrice: totalPrice
        });

        // Sauvegarder l'ID de réservation en session pour la page de confirmation
        context.session.set('reservationId', reservation[0].id);
        context.session.set('reservationNumber', `R${reservation[0].id.toString().padStart(6, '0')}`);
        context.session.set('reservationSuccess', true);
        context.session.set('emailSent', emailResult.success);
        context.session.set('emailError', emailResult.error || null);

        return {
          success: true,
          reservationId: reservation[0].id,
          reservationNumber: `R${reservation[0].id.toString().padStart(6, '0')}`,
          emailSent: emailResult.success
        };

      } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        context.session.set('reservationSuccess', false);
        context.session.set('reservationError', error.message || 'Une erreur est survenue');
        
        return {
          success: false,
          error: error.message || 'Une erreur est survenue'
        };
      }
    }
  })
};