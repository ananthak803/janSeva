# JanSeva - Public Service Mobile App</br>
JanSeva is a mobile application built with React Native that enables citizens to report and track civic issues (like potholes, garbage, water problems, broken streetlights, etc.) using their real-time location.</br>
The goal is to improve public service response and promote transparent issue resolution.

## Features
### User Features
- Report civic issues with GPS-based auto-location
- Upload images while creating reports
- Track status of submitted issues
- Receive updates when issue status changes
- User authentication (login/signup)
### Admin Features
- View all reported issues
- Assign issues to field officers
- Update resolution status
- Manage high-priority reports

## Tech Stack
### Frontend
- React Native with expo
- React
### Backend
- Node.js
- Express.js
- MongoDB/mongoose
- Cloudinary

## Installation and Setup
### Clone this repo
```
 git clone https://github.com/ananthak803/janSeva
 cd janSeva
```
### Frontend App setup
- Create a .env file inside frontend folder
- Add these two keys in your .env file
  1. EXPO_PUBLIC_BACKEND_API = http:/\<your ip address\>:3000
  2. EXPO_PUBLIC_CLOUDINARY_NAME = \<cloudinary cloud name\>
```
cd frontend
npm install
npx expo start
```
