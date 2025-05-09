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

## Common Language

These words/phrases are what will be used throughout our documentation. Each word/phrase will have a short description and possibly an example (if necessary).

- Quests -> Quests are requests for data made by researchers to the public (users/"Explorers). Quests have the type of plant/animal that researchers are looking to gain knowledge on. Only researchers can make quests, and only "Explorers" can complete quests. The data for these quests 
- Explorer -> The explorer is a specific persona/user who has limited permissions on our app. They have the ability to view "Researcher-Quests" and to complete them.

---

## Features

- Generic -> Google sign API, so that users do not need to remember their password/username when logging into   our app.
- Researcher -> Create a quest for Explorers to complete.
            Quests Contain
                -> geographic position that the quest needs to be completed in
                -> a picture of the plant/animal to get data on
                -> a description of what type of information the researcher is looking for. For example, 
                the researcher might inform the Explorer that they are looking for disease in plants, or want
                to know the size/quantity of a subject. What types of behaviors of an animal that they want to
                see or have notes on. 
                -> quantity/size data. This will have a set of approximate ranges for the Explorer to click (radial).
- Researcher -> Extract data from database for their research.
- Researcher -> Create plant/animal species pages that have details about them.
- Explorer -> Search for Quests to complete.
- Explorer -> Complete quests by getting the photos, notes, and quantity/size that has been requested by a 
            researcher
- Explorer -> Find out what type of plant is in front of them by photographing it and having our app 
            (with th aid of an AI API) figure out what type of plant is.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: JQuery, NodeJS
- **Database**: Studio3T
- **Source Control**: SourceTree, GitHub, P4Merge
- **API**: tailwind, Google Single sign-on(SSO)

---

## Usage

This will be a walk through of how to use the app. 
Explaining the features and use cases.

---

## Project Structure


```
├── public/              # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/               # EJS templates
│   ├── partials/        # Header, footer, etc.
│   └── pages/           # Page views like home.ejs, about.ejs
│
├── routes/              # Route definitions
│   ├── index.js         # Main route (e.g., GET /)
│   └── users.js         # Example route file (GET /users)
│
├── index.js             # Entry point (Express setup)
├── package.json
```

---

## Acknowledgments

Put what code snippets were used, and from where. this is to ensure we meet academic integrity standards

---

## Limitations and Future Work

what the app can not do, or would like to have it do.

### Limitations



### Future Work



---

## License


N/A