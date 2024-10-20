# App Store Application

## Description

This application is a web-based platform that allows users to browse, search, and view details of various applications available in the App Store. It features a responsive design, infinite scrolling, and real-time search capabilities, providing a seamless user experience.

## Demo

A live demo of the application can be accessed at [App Store](https://app-store-pretest.vercel.app/).

## Installation

### Prerequisites

- Node.js (version 18 or above)
- npm or yarn

### Steps to Install

1. **Clone the Repository**

   ```bash
   git clone https://github.com/wintersprouter/app-store-pretest.git
   cd app-store-pretest
   ```

2. **Install Dependencies**
   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Start the Application**
   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`.

## Deployment

To deploy the application, you can use platforms like Vercel or Netlify. Ensure that you build the application for production using:

```bash
npm run build
```

or

```bash
yarn build
```

Follow the specific deployment instructions for your chosen platform.

## Features

- **Application List Display**: Browse a list of free and top-grossing applications.
- **Search Functionality**: Search for applications using keywords with real-time updates.
- **Infinite Scrolling**: Automatically load more applications as you scroll down.
- **Application Details**: View detailed information about each application, including ratings and user reviews.
- **Responsive Design**: Optimized for various devices to ensure a good user experience.
- **Error Handling**: Gracefully handle errors when fetching data and display appropriate messages.

## Tech Stack

- **Frontend**: React, TypeScript, Ant Design, TailwindCSS
- **Backend**: Next.js, Axios
- **State Management**: React Query
