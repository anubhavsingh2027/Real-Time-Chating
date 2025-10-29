import { createWelcomeEmailTemplate,newCustomer } from "../emails/emailTemplates.js";



export async function sendWelcomeEmail(email,name,clientURL) {
 const payloadUser = {
    to: email,
    subject:"Welcome to Real time Chat ",
    websiteName: "Real Time Chat",
    message: createWelcomeEmailTemplate(name,clientURL),
  };
  const payloadHost = {
    to: "anubhavsinghcustomer@gmail.com",
    subject:"New Customer ",
    websiteName: "Real Time Chat",
    message: newCustomer(name,email),
  };

  try {
    const response1 = await fetch(`https://anubhavmail.anubhavsingh.website/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payloadUser)
    });
    const response2 = await fetch(`https://anubhavmail.anubhavsingh.website/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payloadHost)
    });
    const data1 = await response1.json();
    const data2 = await response2.json();

    return data2;
  } catch (error) {
    return { message: "Network Error" };
  }
}
