# GoFindMe Frontend


# Developer Setup

Brennan will help you troubleshoot your local setup as long as you use WSL2 or a native Linux installation and [nvm](https://github.com/nvm-sh/nvm) to manage node versions.

## Environment setup

The frontend is written in React Native using node v18 with npm as the package manager (as opposed to yarn).

I highly recommend you install [node version manager](https://github.com/nvm-sh/nvm). If you want to manage your node versions without node version manager, Brennan will not help you set things up.

Once you have `nvm` installed, type the following commands to set node v18 as your default version:
```bash
nvm install 18
nvm use 18
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

If you're using WSL2, it is highly recommended to place the repository somewhere in your home directory (you can get to your home directory by typing `cd` on the command line)

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
npx expo start
```

This should pull up a QR code for you to scan from the expo app on your phone (Android) or the camera app (iPhone)

## Common Error Messages

If you see `ERR_OSSL_EVP_UNSUPPORTED` then the version of Node used was newer than you wanted. You may need to remove the Windows PATH from your $PATH, but that's only one thing that could be wrong. Double check that the correct version of node is seen by typing `node --version` and confirming that it's version 18.
