# Contact patient

The goal of this project is to extend an existing website.

The website currently lists a doctors patients. The doctor now wishes to iterate through patients and mark them as "contacted".

The doctor can have many patients. Currently there are only 20, but in theory a lazy doctor might have 1000+ patients to contact.

All pages have been setup, however it is your task to implement the iteration and display logic. You are allowed to extend, change or remove anything you like (pages, components, database queries, api endpoints etc.), as long as the final result has the expected requirements. You are also allowed to impose limitations in the system, if you can explain why these limitations were necessary / a good idea.

Note that styling is not important. Only the logic and thoughts behind are necessary.

Below is a list of requirements from the doctor:
- View all patients (both contacted and not contacted) - already implemented
- View details of a single patient - already implemented
- The doctor should see how many patients he / she has been through, as well as how many are remaining, when viewing a patient
- The doctor should be able to start iterating through the patients from the patient selected (e.g. number 4 on the list)
- The doctor should be able to change the state of the patient to contacted or not contacted
- The doctor should not be required to return to the list view to go to the next patient. There should be some next / previous buttons when viewing a patient. However, being able to iterate through all patients in one go is not a requirement, but something that the doctor insists is needed.
- When the doctor returns to the list view, the most recent data should be displayed (e.g. a patient marked as contacted should be shown as such on the list page) - maybe implemented? You should test this :-)

There are several todos throughout the solution that can be a good idea to start with.


# Setup

## NVM
This project uses Node Version Manager (nvm) to ensure all developers are running the same version of node. NVM must therefore be installed. Documentation for NVM can be found here:
https://github.com/nvm-sh/nvm

To use the correct node version, use the following command:

`nvm use`

## Node packages
To install the required packages, you must have yarn installed. Then run the command:

`yarn install`

## Application cache and wierd problems

If you experience any weird problems that might be related to build cache, you can always delete the `/dist` and `/node_modules/.cache` directories and rebuild your application. 

Furthermore, deleting the `/node_modules` directory and running `yarn install` can also be a good troubleshooting technique.

## Running the database

Run `yarn run start-database` to start the database server (mysql 10.2). This database will automatically be setup with a user for the api and be vailable on localhost:3306.

The database password is "guest1234" for both root and the api user. See `./docker-compose/assets/init-database.sql` to see which database and user has been created.

## Running react application

Run `yarn nx serve desktop-web` to run the web application. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Running nestjs application

Run `yarn nx serve api` to run the nestjs api application. It is available on http://localhost:3333. The api will automatically reload if you change any of the source files.

## Viewing swagger documentation

In order to view swagger documentation for the API, the API must be running. Swagger will be available on http://localhost:3333/api

# Seeding data

Data is seeded using the seed controller in API. At the top of the `SeedController` on line 12 the `defaultPatientsCount` is used to determine how many patients should be created. You can change this value to experiment with larger datasets.

Seeding is done by posting to the seed controller. This is also available in a button on the patient overview page.

# Project structure

We use a NX monorepo (https://nx.dev/). The relevant folder structure is shown below.

    .
    ├── apps - Runnable applications
    │   ├── api - NestJS API application
    │   │   └── src
    │   │       ├── app - Application code
    │   │       │   ├── controllers - All controller files
    │   │       │   ├── modules - All modules files. Here database entities and services can be found
    │   │       │   └── app.module.ts - File responsible to initializing modules, dependency injection etc., e.g. database connection
    │   │       └── main.ts - File responsible for starting api server
    │   └── desktop-web - Frontend application
    │       └── src
    │           ├── app - Application code
    │           │   ├── pages - Directory containing all pages
    │           │   └── app.tsx - File containing main styling and routing
    │           └── main.tsx - File responsible for rendering the frontend application
    ├── docker-compose - Docker-compose file and assets for running mysql server
    └── libs - libraries shared between applications
        └── dtos - DTOs shared between frontend and backend

# Component library

Ant design is used as component library. You can find all components and their documentation here at: https://ant.design/components/overview 

# Notes

Typeorm is used as the API ORM. Note that version 0.2.39 is used, instead of the newest version.
