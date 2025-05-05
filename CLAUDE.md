# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Build: `pnpm build` - builds the production site to `./dist/`
- Dev: `pnpm dev` - starts local dev server at `localhost:4321`
- Preview: `pnpm preview` - previews build locally before deploying
- Check types: `pnpm astro check` - runs type checking

## Code Style Guidelines

- **Imports**: Group imports by type (Astro, React, utilities) with Astro imports first
- **TypeScript**: Use strict TypeScript with explicit interfaces for component props
- **Components**: Use Astro components (`.astro` files) with a clear separation between frontmatter and markup
- **CSS**: Use Tailwind CSS utility classes in component templates
- **Naming**: Use PascalCase for components, camelCase for variables and functions
- **Error Handling**: Use type-safe error handling with proper user feedback
- **File Structure**: Components in `src/components/`, layouts in `src/layouts/`, pages in `src/pages/`
- **Project Structure**: Follow Astro conventions; static assets go in `public/`

# Projet Astro-Tailwind - Système de Réservation

## Description

Ce projet est un système de réservation développé avec Astro et Tailwind CSS.
Il utilise Astro DB comme base de données pour gérer les réservations.

## Objectif du projet

Création d'un système de réservation permettant aux utilisateurs de:

- Procéder par étapes il y en a 6 en tout
- Choisir le nombre de personnes max 6
- Choisir entre VR et VR sans fil ( proposer uniquement VR si plus de 4 personnes )
- Choisir une durée entre 30 min et 1h
- Sélectionner une date (proposer uniquement les jours)
- Sélectionner les horaires disponibles pour la date choisis ( adapter en fonction des disponibilités et de la durée choisi)
- Demander les coordonnées du client ( nom ou prénom , mail et téléphone)
- Confirmer la réservation

## Technologies clés

- Astro framework
- Tailwind CSS pour le styling
- Astro DB pour la persistance des données

## Structure de données

- Collections Astro DB prévues:
  - Réservations
  - Utilisateurs
  - TimeSlots
  - Ressouces

## Prix

- 1-2 personnes: 29€/personne
- 3-4 personnes: 27€/personne
- 5-6 personnes: 25€/personne

## instructions

- ne lance pas le server.
