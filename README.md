# MyFlixAngularClient

Welcome to MyFlixAngularClient, an Angular-based client application for the myFlix movie app. This project interacts with a backend API to manage user accounts and favorite movies.

## Table of Contents

- [MyFlixAngularClient](#myflixangularclient)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Objectives](#objectives)
    - [Key Features](#key-features)
    - [Technical Requirements](#technical-requirements)
  - [Installation](#installation)
  - [Usage](#usage)

## Overview

MyFlixAngularClient is a single-page, responsive movie app built with Angular. It supports user registration, authentication, and interaction with a REST API to fetch movie data. This project is part of an educational exercise to demonstrate Angular proficiency and documentation skills.

### Objectives

The objective of this project is to build a client-side interface for the myFlix app using Angular. This interface includes several views for browsing movies, exploring details about directors and genres, and managing user profiles. The app is accompanied by comprehensive technical and user documentation.

### Key Features

- **Authentication:** Users can register and log in to manage their favorite movies.
- **Movie Views:** Browse all movies, view details of a specific movie, and navigate to director and genre details.
- **Responsive Design:** Ensures optimal viewing across devices.
- **Angular Material:** Utilizes Angular Material for UI components.

### Technical Requirements

- **Angular Version:** 9 or later
- **Node.js and npm:** Latest versions
- **User Management:** Registration and login forms
- **Design Framework:** Angular Material
- **Documentation:** Typedoc for code comments, JSDoc for technical documentation
- **Hosting:** GitHub Pages (Render hosts the API)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/timone019/myFlix-Angular-client.git
   
   cd MyFlixAngularClient

2. **Install dependencies:**
   ```bash
   npm install

## Environment Setup

The Angular client reads the backend base URL from `environment.ts` / `environment.prod.ts` (`apiBaseUrl`).

1. Local dev already targets `https://move-api-kw8t.onrender.com/`. To point elsewhere, edit `src/environments/environment.ts` (and `environment.prod.ts` for builds).
2. Keep `apiBaseUrl` trailing slash so existing service calls (which append endpoints) continue to work.

## Usage

1. **Start the dev server:**
   ```bash
   ng serve
   ```

2. **Build & deploy to GitHub Pages (gh-pages branch):**
   ```bash
   npx ng deploy --base-href=/myFlix-Angular-client/
   ```
   This compiles with the production environment (Render URL) and publishes to GitHub Pages via `angular-cli-ghpages`.