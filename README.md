HerShield

Your Safety. One Tap Away.

A personal safety web application designed to help users prepare, respond, and document during safety incidents.

Features
SOS Emergency Alert — Activate an emergency workflow using real GPS location.
Trusted Contacts — Add and manage people who should receive emergency alerts.
Live Location Sharing — Share a real-time location tracking link.
Find Help — Locate nearby police stations, hospitals, ambulances, and relevant safety resources.
Safe Route — Get walking routes with turn-by-turn navigation and safety-focused information.
Incident Reporting — Record incidents with location information.
Private Evidence Storage — Attach evidence to incident reports using private cloud storage.
Emergency PIN — Protect SOS deactivation with a 4-digit security PIN.
India Emergency Resources — Quick access to emergency services such as 112 and other relevant helplines.
PWA Support — Installable web application with offline app-shell support.
How HerShield Works

HerShield is designed around three stages of personal safety:

Before an incident

Safe Route
Find Help
Trusted Contacts
Live Location Sharing

During an emergency

SOS activation
GPS location
Emergency contact notifications
Emergency resource access

After an incident

Incident reporting
Location information
Private evidence storage
Persistent incident records
Tech Stack

Frontend

React
TypeScript
Vite
Tailwind CSS
React Router
Lucide React

Backend

Node.js
Express
TypeScript

Authentication

Firebase Authentication

Database & Storage

Supabase PostgreSQL
Supabase Storage

Maps & Routing

Leaflet
OpenStreetMap
Google Routes API

Deployment

Google AI Studio / Firebase Hosting
Authentication Architecture

HerShield uses Firebase Authentication for user identity while retaining Supabase for the existing database and private storage.

Firebase Authentication
        ↓
Firebase UID
        ↓
firebase_user_mapping
        ↓
HerShield Internal UUID
        ↓
Supabase Database / Storage

This allows existing HerShield data to remain associated with its internal UUID while authentication is handled by Firebase.

Security
Firebase ID tokens are verified server-side.
Emergency PINs are stored as cryptographic hashes, not plaintext.
Evidence files are stored in a private storage bucket.
Server-only credentials are kept out of client-side application code.
Protected API routes require authentication.
SOS deactivation requires the configured Emergency PIN.
Emergency Handling

HerShield can provide quick access to emergency services and nearby resources.

Important: HerShield does not claim to automatically contact police, ambulance, or other emergency responders unless an actual authorized integration exists.

Project Structure
HerShield/
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   └── services/
├── server/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── storage/
├── supabase/
├── public/
├── vite.config.ts
└── package.json
Getting Started
Prerequisites
Node.js
npm
Firebase project
Supabase project
Required API credentials for enabled services
Installation
git clone <your-repository-url>
cd HerShield
npm install
Environment Variables

Create the required environment configuration for your local environment.

Never commit secrets or .env files containing private credentials to GitHub.

Examples of server-side secrets include:

SUPABASE_SECRET_KEY
FAST2SMS_API_KEY
TWILIO_AUTH_TOKEN
MAPS_API_KEY

Firebase Web configuration is client-side configuration, while Firebase Admin credentials/private keys must remain server-side and secret.

Run locally
npm run dev
Build
npm run build
Important Limitations
SMS delivery depends on the configured SMS provider and account availability.
Emergency response integrations require appropriate official/authorized access.
Browser GPS requires user permission.
Some functionality depends on external mapping and geocoding services.
Offline support is focused on the application shell; live SOS, GPS, database, and external API operations require connectivity.
Roadmap
Official emergency-response integration
More robust offline emergency workflows
Expanded regional emergency resources
Improved accessibility
Additional safety analytics and reporting
Disclaimer

HerShield is a personal safety application and should not be considered a replacement for official emergency services.

In an immediate emergency, contact the appropriate emergency service directly.

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.
## Copyright & Ownership

© 2026 Ayush Ranjan. All Rights Reserved.

HerShield is an independently developed personal safety platform.

The source code, original UI/UX implementation, documentation,
and original project assets are owned by Ayush Ranjan.

No permission is granted to copy, reproduce, modify, redistribute,
publish, or commercially use this project or substantial portions
of its source code without prior written permission.

HerShield is provided for demonstration and educational purposes.
