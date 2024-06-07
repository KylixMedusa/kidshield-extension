# KidShield Extension

KidShield Extension is a Chrome browser extension designed to provide a safe browsing experience for kids by filtering out inappropriate content and monitoring their online activity. This extension is built with React and TypeScript.

## Installation

To install the KidShield Extension, follow these steps:

### For Development

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/KylixMedusa/kidshield-extension.git
   cd kidshield-extension
   ```

2. **Install Dependencies:**
   Ensure you have pnpm installed. Then, install the required dependencies:
   ```bash
   pnpm install
   ```

### For Production

1. **Build the Extension:**
   Create a production-ready build of the extension:
   ```bash
   pnpm run build
   ```

2. **Load the Extension in Chrome:**
   - Open Chrome and navigate to the Extensions page (`chrome://extensions/`).
   - Enable "Developer mode".
   - Click on "Load unpacked" and select the `dist` folder from the project directory.

## Usage

1. **Opening the Extension:**
   Once the extension is loaded in Chrome, you can access it by clicking on the KidShield icon in the toolbar.

2. **Login:**
    Parents can log in to the extension using their credentials to access the monitoring and content filtering features.

3. **Settings:**
   Dashboard allows parents to customize the filtering settings, view activity reports. To check the dashboard visit [KidShield Dashboard](https://github.com/kylixmedusa/kidshield-dashboard).

## Contributing

We welcome contributions from the community! To contribute to KidShield Extension, follow these steps:

1. **Fork the Repository:**
   Click the "Fork" button at the top right of the repository page to create a copy of the repo under your GitHub account.

2. **Clone the Forked Repository:**
   ```bash
   git clone https://github.com/your-username/kidshield-extension.git
   cd kidshield-extension
   ```

3. **Create a New Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes and Commit:**
   Implement your changes and commit them with a descriptive message:
   ```bash
   git add .
   git commit -m "Add feature: your-feature-name"
   ```

5. **Push to Your Fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request:**
   Go to the original repository on GitHub and submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
