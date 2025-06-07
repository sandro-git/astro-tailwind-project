import { defineDb, defineTable, column } from 'astro:db';

// Define tables
export const Reservations = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    numberOfPeople: column.number(),
    vrType: column.text(),  // 'VR' or 'VR_WIRELESS'
    dateTime: column.date(),
    duration: column.number(), // Duration in minutes (30 or 60)
    fullName: column.text(),
    email: column.text(),
    phoneNumber: column.text(),
    createdAt: column.date(),
    // Ajouter le prix total calculé
    totalPrice: column.number({ optional: true })
  }
});

export const TimeSlots = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    startTime: column.date(),
    endTime: column.date(),
    maxCapacity: column.number({ default: 6 }),
    isAvailable: column.boolean({ default: true }),
  }
});

export const Resources = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    type: column.text(), // 'VR' or 'VR_WIRELESS'
    quantity: column.number(),
    maxUsers: column.number(),
  }
});

export const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    fullName: column.text(),
    email: column.text({ unique: true }),
    phoneNumber: column.text(),
    createdAt: column.date(),
  }
});

// Export the DB
export default defineDb({
  tables: {
    Reservations,
    TimeSlots,
    Resources,
    Users,
  }
});