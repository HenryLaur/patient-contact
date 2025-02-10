# Bonus Question

Q: The attached is an example for the final result of a eConsult handled in our platform. Can you write a few lines on how you would approach serialising the information in the PDF in a HL7 message

A: There are a few different ways to approach this and the exact solution depends on the specific requirements of the HL7/CDA message.

It might be possible to add the pdf as an attachment to the CDA document.

The attachments are encoded in base64 and added to the correct element in the CDA document.

1. Load CDA document into memory, for node I found fast-xml-parser

```typescript
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
const parser = new XMLParser({ ignoreAttributes: false });

const cdaXml = readFileSync(join(__dirname, filePath), 'utf-8');
const jsonObj = parser.parse(cdaXml);
```

2. Load pdf into memory and convert to base64

```typescript
const pdfBuffer = readFileSync(join(__dirname, filePath));
const base64Pdf = pdfBuffer.toString('base64');
```

3. Add base64 pdf to the CDA document this step depends on the requirements of the CDA document so here are a few examples:

   3.1. Add it directly to the attachment element

   ```xml
   <ObservationMedia>
       <value mediaType="application/pdf">
           <data>BASE64_ENCODED_STRING</data>
       </value>
   </ObservationMedia>
   ```

   ```typescript
   const document = jsonObj.ClinicalDocument;
   document. ... .ObservationMedia.value.data = base64Pdf;
   ```

   3.2. Add as a reference

   ```xml
   <ObservationMedia>
       <value mediaType="application/pdf">
           <reference name="document.pdf"></data>
       </value>
   </ObservationMedia>
   ```

   ```typescript
   const document = jsonObj.ClinicalDocument;
   document.ObservationMedia.reference.name = 'document.pdf';
   ```

   Then in add the reference data to the CDA envelope

   ```xml
   <text mediaType="text/plain">
   MIME-Version: 1.0
   Content-Type: multipart/related; type ="text/xml";  boundary="MIME_boundary";

   --MIME_boundary
   Content-ID: &lt;SOME_ID&gt;
   Content-Location: document.pdf
   Content-Type: application/PDF
   Content-Transfer-Encoding: BASE64

   BASE64_ENCODED_STRING
   --MIME_boundary
   </text>
   ```

Otherwise add the general patient/author/diagnosis CDA data, load the CDA document into memory just like in step 1. Then add the data to the CDA.

```typescript
const document = jsonObj.ClinicalDocument;
// metadata
document.ClinicalDocument.languageCode = "en-US";
document.ClinicalDocument.versionNumber = "1.0";
document.ClinicalDocument.effectiveTime = "2024-01-01T00:00:00.000Z";

// patient
document.ClinicalDocument.recordTarget.patientRole.patient.name.given = "June";
document.ClinicalDocument.recordTarget.patientRole.patientname.given = "Carlsen";
document.ClinicalDocument.recordTarget.patientRole.patientname.administrativeGenderCode = "F";

// author
document.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given = "Niels Kvorning";
document.ClinicalDocument.author.assignedAuthor.assignedPerson.name.family = "Ternov";

// diagnosis
document.ClinicalDocument.component.section.entry.observation.code = "R21";
document.ClinicalDocument.component.section.entry.observation.codeSystem = "DIAGNOSIS_CODE_SYSTEM";
document.ClinicalDocument.component.section.entry.observation.displayName = "RASH AND OTHER NONSPECIFIC SKIN ERUPTION"

// referral
...

// images
The images can be attached similarly to the pdf example above.
```

In the end we can convert the document to XML and send it as a HL7 message.

```typescript
const builder = new XMLBuilder({ ignoreAttributes: false });
const xml = builder.build(jsonObj);
```

And it will look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 ../schema/CDA.xsd">

    <!-- Metadata -->
    <languageCode code="en-US"/>
    <versionNumber value="1.0"/>
    <effectiveTime value="2024-01-01T00:00:00.000Z"/>

    <!-- Patient -->
    <recordTarget>
        <patientRole>
            <patient>
                <name>
                    <given>June</given>
                    <family>Carlsen</family>
                </name>
                <administrativeGenderCode code="F" displayName="Female" codeSystem="SOME_OID"/>
            </patient>
        </patientRole>

    </recordTarget>

    <!-- Author -->
    <author>
        <assignedAuthor>
        <!-- Other author data -->
            <assignedPerson>
                <name>
                    <given>Niels</given>
                    <family>Ternov</family>
                </name>
            </assignedPerson>
        </assignedAuthor>
    </author>


    <!-- Diagnosis -->
    <component>
        <section>
            <entry>
                <observation>
                    <code code="R21" codeSystem="DIAGNOSIS_CODE_SYSTEM" displayName="RASH AND OTHER NONSPECIFIC SKIN ERUPTION"/>
                <!-- Other diagnosis data -->
                </observation>
            </entry>
        </section>
    </component>

    <!-- Referral -->
    <component>
        <!-- Referral section -->
    </component>

    <!-- Images -->
    <component>
        <!-- Image section -->
    </component>
</ClinicalDocument>
```

# Contact patient

Below is a list of requirements from the doctor:

- View all patients (both contacted and not contacted) - **already implemented**
- View details of a single patient - **already implemented**
- The doctor should see how many patients he / she has been through, as well as how many are remaining, when viewing a patient - **implemented with /index endpoint**
- The doctor should be able to start iterating through the patients from the patient selected (e.g. number 4 on the list) - **implemented with /index endpoint**
- The doctor should be able to change the state of the patient to contacted or not contacted - **implemented with /update endpoint**

- The doctor should not be required to return to the list view to go to the next patient. There should be some next / previous buttons when viewing a patient. However, being able to iterate through all patients in one go is not a requirement, but something that the doctor insists is needed. - **implemented with /index endpoint**
- When the doctor returns to the list view, the most recent data should be displayed (e.g. a patient marked as contacted should be shown as such on the list page) - maybe implemented? You should test this :-) **Seemed to work, since the data is fetched from the database each time the page is loaded the data is up to date**

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
