# Safe Base - Extension Wallet

## 📚 Tech Stack

![tech_stack](https://user-images.githubusercontent.com/13044958/177345668-2710a22a-e7c0-4bd7-8637-6dc56b816c8d.png)

<hr />

## 🚀 Quick Start

Ensure you have:

- [Node.js](https://nodejs.org) 16 or later installed
- [Yarn](https://yarnpkg.com) v1 or v2 installed

Then run the following:

### 1) Clone the repository

```bash
git clone https://github.com/nakul91/safe-extension.git && cd safe-extension
```

### 2) Install dependencies

```bash
yarn install
```

### 3) Build

Builds the extension for production to the `dist` folder.<br>
It correctly bundles in production mode and optimizes the build for the best performance.

```bash
# for Chrome by default
yarn build
```

## 🧱 Development

```bash
yarn start
```

- `yarn start` - run `vite`
- `yarn build` - builds the production-ready unpacked extension
- `yarn test -u` - runs Jest + updates test snapshots
- `yarn lint` - runs EsLint
- `yarn prettify` - runs Prettier

Runs the extension in the development mode for Chrome target.<br>
It's recommended to use Chrome for developing.
