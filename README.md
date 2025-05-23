# Project Name

## About Us

Team Name: BBY-27
Team Members:

- Rayen Ben Moussa
- Minsu Kim
- Tony Chen
- Blair Tate
- Jazib jeehan

## Overview

The world is rich with biodiversity, but much of it goes unnoticed and undocumented. Our web app, Global Biodiversity Mapper, lets users crowdsource sightings of birds, insects, and plants using photo ID with AI, seasonal heatmaps, and species and area requests (possibly by researchers). It promotes citizen science, supports research, and raises awareness of urban ecology through interactive, gamified exploration. Technology shouldn't be about disconnecting with the physical world, but about promoting connection, and living in harmony with it. This app will empower citizens to be involved with the environment on a sensory level, and engage with scientists and researchers to see their involvement directly contribute to the improvement of their land.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (or access to a MongoDB Atlas cluster)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mskim9097/2800_202510_BBY27.git
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    - See list of dependencies
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. This file will store your sensitive configuration data. Add the following variables, replacing the placeholder values with your actual credentials and settings:

    ```env
    # Server Configuration
    PORT=8000

    # MongoDB Configuration
    MONGODB_USER=<your_mongodb_username>
    MONGODB_PASSWORD=<your_mongodb_password>
    MONGODB_HOST=<your_mongodb_cluster_host_and_options_if_any>
    # Example for local MongoDB: MONGODB_HOST=localhost:27017
    # Example for MongoDB Atlas: MONGODB_HOST=yourcluster.mongodb.net

    # Session Secrets
    NODE_SESSION_SECRET=<your_strong_session_secret>
    MONGODB_SESSION_SECRET=<your_strong_mongodb_session_store_secret>

    # Cloudinary Configuration (if used for image uploads)
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

    # OpenAI API Key (if used for AI features)
    OPENAI_API_KEY=<your_openai_api_key>
    # For OpenRouter, the key might look like: sk-or-v1-...
    OPENROUTER_API_KEY=<your_openrouter_api_key>
    ```
    **Important:** Add `.env` to your `.gitignore` file to prevent committing sensitive credentials.

4.  **Run the application:**
    ```bash
    npm start  # Or nodemon if you have it configured in package.json scripts
    ```
    If you don't have a start script configured for nodemon, you can run it directly:
    ```bash
    nodemon index.js
    ```
5. **Testing**
    - Please see the attached link for tests
    https://docs.google.com/spreadsheets/d/1-oYDfiXsRTIhCOYz-c7OUQHvG0js3QYUdl6YsJRrbXk/edit?gid=394496370#gid=394496370 

## Running Linters and Formatters

This project uses ESLint for linting and Prettier for code formatting.

- **Check for linting issues:**
  ```bash
  npm run lint
  ```
- **Automatically fix linting issues:**
  ```bash
  npm run lint:fix
  ```
- **Format code with Prettier:**
  ```bash
  npm run format
  ```

---

## Dependencies

### Production Dependencies

- `axios`: Promise based HTTP client for the browser and node.js.
- `bcrypt`: A library to help you hash passwords.
- `cloudinary`: Cloudinary SDK for Node.js (image and video management).
- `connect-mongo`: MongoDB session store for Express.
- `dotenv`: Loads environment variables from a .env file into process.env.
- `ejs`: Embedded JavaScript templating.
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `express-session`: Simple session middleware for Express.
- `fs`: File system module (Node.js built-in).
- `joi`: Object schema description language and validator for JavaScript objects.
- `mongodb`: The official MongoDB driver for Node.js.
- `mongoose`: Elegant MongoDB object modeling for Node.js.
- `multer`: Node.js middleware for handling multipart/form-data, primarily used for uploading files.
- `nodemon`: Utility that will monitor for any changes in your source and automatically restart your server.
- `openai`: OpenAI Node.js API library.
- `path`: Node.js path module (Node.js built-in).

### Development Dependencies

- `eslint`: Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- `eslint-config-airbnb-base`: ESLint shareable config for Airbnb's JavaScript style guide (without React plugins).
- `eslint-config-prettier`: Turns off all ESLint rules that are unnecessary or might conflict with Prettier.
- `eslint-plugin-import`: ESLint plugin with rules that help validate proper imports.
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule.
- `prettier`: An opinionated code formatter.

---

## Common Language

These words/phrases are what will be used throughout our documentation. Each word/phrase will have a short description and possibly an example (if necessary).

- Quests -> Quests are requests for data made by researchers to the public (users/"Explorers). Quests have the type of plant/animal that researchers are looking to gain knowledge on. Only researchers can make quests, and only "Explorers" can complete quests. The data for these quests
- Explorer -> The explorer is a specific persona/user who has limited permissions on our app. They have the ability to view "Researcher-Quests" and to complete them.
- Researcher -> The researcher is a specific persona/user who has all permissions that an Explorer has plus additional permissions. The researcher is able to create/update/delete new species and quests. Their main goal is to get data from explorers in order to assist them with their research goals.

---

## Features

- **Generic**
  - 
- **Researcher**
  - Create a quest for Explorers to complete.
  **Quests Contain**
    -> geographic position that the quest needs to be completed in
    -> a picture of the plant/animal to get data on
    -> a description of what type of information the researcher is looking for. For example,
  the researcher might inform the Explorer that they are looking for disease in plants, or want
  to know the size/quantity of a subject. What types of behaviors of an animal that they want to
  see or have notes on.
    -> quantity/size data. This will have a set of approximate ranges for the Explorer to click (radial).
  - Extract data from database for their research (NOT FOR MVP).
  - Create plant/animal species pages that have details about them.
- **Explorer**
  - Search for Quests to complete.
  - Complete quests by getting the photos, notes, and quantity/size that has been requested by a
  researcher
  - Search for species.
  - Find out what type of plant is in front of them by photographing it and having our app
  (with th aid of an AI API) figure out what type of plant is (NOT FOR MVP).

---

## Technologies Used

- **Frontend**:
  - HTML
  - CSS
  - JavaScript
  - EJS (Embedded JavaScript templates)
  - Tailwind CSS (via CDN)

- **Backend**:
  - Node.js
  - Express.js

- **Database & Storage**:
  - MongoDB (with Mongoose ODM)
  - Cloudinary (for image storage and management)

- **Authentication & Session**:
  - bcrypt (for password hashing)
  - express-session (for session management)
  - connect-mongo (MongoDB session store)

- **Development & Tooling**:
  - npm (Node Package Manager)
  - ESLint (JavaScript linter)
  - Prettier (Code formatter)
  - Nodemon (for automatic server restarts during development)
  - Dotenv (for environment variable management)
  - Joi (for data validation)
  - Git & GitHub (for version control)
  - Studio 3T
  - SourceTree
  - Visual Studio

- **APIs & Services (External)**:
  - OpenAI API / OpenRouter API (for AI-powered features like riddles)
  - Mapbox GL JS (if used for interactive maps, as seen in some EJS files)

---

## Usage

The main goal of our app BiodiversityGo is to allow the researching community to crowd-source data for their research on our natural environment. As such there are two user types, Explorers and Researchers.

**Generic**
A user will create an account, choosing to be a researcher or an explorer. Once their account is created they will then need to login.

All users have links to the species list page, quests list page, and to the AI riddle game. They do not necessarily see the same things on some of these pages, which is explained in greater detail below.

All users are able to click on the magic wand icon in order to play the AI riddle game, which lets them test their knowledge of various natural species.

**Researcher**
Once a researcher has logged in they will be taken to the researcher dashboard, which shows them a map relative to their position, a list of quests, and the top/bottom navigation systems.

The bottom nav can take them to the researcher dashboard, the species list page, quest list page, or to an AI riddle game page.

If you click on the species list page you will be taken to see all species currently stored within the database. The researcher can click on a species card to be taken to that specie's page, they can search for a species by typing in the name, or they can click the plus icon to add a species to the database. If a researcher clicks on the add species button, they will be taken to a form where they can add the scientific name, common name, species type (plant, animal, insect, bird, other), info on the species, their habitat, and then upload an image of that species. The researcher must fill out all fields in order to submit. Once submitted it will then be populated in the species list page. 

The researcher can also add a quest for an explorer to complete. This is essentially the main goal of our app, because this is where they can ask the public for help on their research. When the researcher clicks on add quest (location tbd), they will be taken to a form where they need to enter; a title, a location (clicked on a map), a description of the mission, the target species (which must come from the list of species in the database), time of day, and the difficulty. Once this is created it will be added to the quest list page (explorer), and also to the researcher's quest list page which only shows their quests.

**Explorer**
Once an explorer logs in they will be taken to a dashboard similar to the researcher. The main difference between these dashboards is that they are not able to create species or quests, and their quests list page shows all available quests. 

The species list page is the same, except as stated above.

The quest list page is the same, except as stated above and one more big difference. If an explorer clicks on a quest, they will then be taken to that quest's page. The explorer can then accept that quest, and then complete it once they have gathered all relevant data. Once they complete the required fields (depending on the quest), it will be submitted, and then the researcher will be able to extract the results. The ability of the researcher to extract this data will not be available for our MVP.

---

## Project Structure

```
.
├── .env                   # Environment variables (ignored by Git)
├── .eslintignore          # ESLint ignore patterns
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore patterns
├── .prettierignore        # Prettier ignore patterns
├── .prettierrc.json       # Prettier configuration
├── README.md              # This file
├── controllers/           # Request handlers (business logic)
│   ├── aiController.js
│   ├── questsController.js
│   ├── speciesController.js
│   └── userController.js
├── databaseConnection.js  # MongoDB connection setup (if separate)
├── index.js               # Main application entry point (Express server setup)
├── models/                # Mongoose data models/schemas
│   ├── questModel.js
│   ├── specieModel.js
│   └── userModel.js
├── package-lock.json      # NPM dependency lock file
├── package.json           # Project metadata and dependencies
├── public/                # Static assets served to the client
│   ├── css/
│   │   └── ... (style files)
│   ├── images/
│   │   └── ... (image files)
│   └── js/
│       └── ... (client-side JavaScript files)
├── routes/                # Express route definitions
│   ├── aiRoutes.js
│   ├── indexRoutes.js
│   ├── questRoutes.js
│   ├── speciesRoutes.js
│   └── userRoutes.js
├── utils.js               # Utility functions
└── views/                 # EJS templates for server-side rendering
    ├── pages/
    │   └── ... (specific page templates)
    └── partials/
        └── ... (reusable template partials like header, footer)
```

---

## Acknowledgments

Put what code snippets were used, and from where. this is to ensure we meet academic integrity standards

- **Cursor**
  - The readMe was built mostly by the developers directly, however, we also used Cursor IDE in order to assist. This helped us determine all production and development dependencies, the project structure and the technologies used.
  - Used in order to make global changes. For example, the addition of red asterisk as a visual cue for required fields was done by cursor in order to streamline a repetitive task. 
  - Used in order to trouble shoot issues that required a global view of the project, since searching for issues with other tools like Chat GPT would be far more complicated in locating a problem.
  - 
- **ChatGPT**
  - Used for troubleshooting and researching.
  - Some code snippets which can be seen in the comments around the code snippets.
- **Images and Icons**
  I Naturalist was to get images and scientific name/common name to populate a bunch of species in our database for showcasing.
  - https://www.inaturalist.org/
  - plant2.jpg -> https://unsplash.com/photos/purple-succulent-plants-gSQbip5HHuc 
  - plant1.jpg -> https://soltech.com/en-ca/blogs/blog/turn-your-succulents-into-delicious-meals 
  - All icons and symbols were taken from Google icons -> https://fonts.google.com/icons 

---

## Limitations and Future Work

what the app can not do, or would like to have it do.

### Limitations
- Not able to currently implement the AI image recognition in order to help explorers find out what type of plant/animal they see in front of.


### Future Work
- Would ideally have it so that researchers actually have to submit an application to be approved by our team, so as to avoid just anyone from adding to our database.
- Would like to have it so that researchers can eventually extract data from their quests in the form of a csv file. Currently they are not able to view the results of their quests.
- Ability of the explorer to be able to save data that they have collected, close the app, and then come back and complete it at a later date.
- Currently the app only supports a quest being completed by one Explorer. It should eventually be able to take multiple sightings and be marked completed once the researcher decides it is done.
- Completing quests only allows uploading one image, but eventually it should accept more than one image.

---

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details (if a separate LICENSE file exists), or refer to the license information specified in the `package.json`.

```
ISC License

Copyright (c) [Year] [Your Name/Organization Name]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
