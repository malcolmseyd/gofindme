# GoFindMe Frontend

# CI/CD todo

1. install JDK 17
2. install android SDK - may need to `chown -R $(whoami) /opt/android-sdk`
3. accept licenses
4. install NPM
5. install EAS CLI
6. log in to EAS
7. build

# Developer Setup

Brennan will help you troubleshoot your local setup as long as you use WSL2 or a native Linux installation and [rtx](https://github.com/jdx/rtx) to manage node versions.

## Environment setup

The frontend is written in React Native using node v18 with npm as the package manager (as opposed to yarn).

I highly recommend you install [rtx](https://github.com/jdx/rtx). If you want to manage your node versions without rtx, Brennan will not help you set things up.

Once you have `rtx` installed, type the following commands to set node v18 as your default version:

```bash
rtx use node@18
```

Now you can verify that the correct version of node is being used by typing

```bash
node --version
```

Also make sure that you have npm installed

```bash
npm --version
```

## Download and set up the code

Works on WSL2 or Linux. Brennan will not support you if you're using Windows CMD/PowerShell.

It is highly recommended to place the repository somewhere in your home directory (you can get to your home directory by typing `cd` on the command line)

Clone the repo:

```bash
git clone git@github.com:malcolmseyd/gofindme.git
```

cd to the frontend directory:

```bash
cd gofindme/frontend
```

Install dependencies:

```bash
npm i
```

## Running the local dev server

```bash
npm run start
```

This should pull up a QR code for you to scan from the expo app on your phone (Android) or the camera app (iPhone)
