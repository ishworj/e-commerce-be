
// user activation email
export const userActivatedEmailTempalate = ({ email, userName, url }) => {
  return ({
    from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Action Required! Activate your Account!", // Subject line
    text: `Click the url to activate your Account. ${url}`, // plain text body
    html: `<div style="max-width: 600px; margin: auto; text-align: center; font-family: Arial, sans-serif;">
        <h1>Hello, ${userName}</h1>
            <br />
            <p style ="margin: 0">Your account has been created. Click the button to Activate your account.</p>
            <a href=${url}><button style="color: white; background : blue; padding: 1rem; border-radius: 10px;">Activate Now</button></a>
            <br />
            <br />
            <p style ="margin: 0">Regards,</p>
            <p style ="margin: 0">Ram</p>
            <p style ="margin: 0">Manager</p>
            <p style ="margin: 0">${process.env.COMPANY_NAME}</p>
        </div>`, // html body
  });
}

export const OTPemailTemplate = ({ OTP, userName, email }) => {
  return ({
    from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your single-use code",
    html: `<div style="max-width: 600px; margin: auto; text-align: center; font-family: Arial, sans-serif;">
        <h1>Hello, ${userName}</h1>
            <br />
            <p>Verification Code</p>
           <div>
            <p style ="margin: 0">Please use the verification code below to update youer new password.</p>
             <strong style="font-size: 130%">${OTP}</strong>
              <p style ="margin: 0">If you didn’t request this, you can ignore this email.</p>
            </div>
            <br />
            <br />
            <p style ="margin: 0">Regards,</p>
            <p style ="margin: 0">${process.env.COMPANY_NAME}</p>
        </div>`,
  })
}

export const orderCreated = ({ userName, email, order, attachments = [] }) => {
  console.log("email being sent 1");

  return {
    from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Order Placed Successfully - Order # ${order._id}`,
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
        <h1>Hi, ${userName}</h1>
        <p style="margin: 0;">
          Thank you for your purchase! We're excited to let you know that your order 
          <span style="color: blue; border: 1px solid black; padding: 2px;">
            ${order._id}
          </span> 
          has been successfully created and is now being processed.
        </p>

        <p style="margin: 16px 0 8px;">We'll notify you as soon as your order ships, along with tracking details so you can follow it every step of the way.</p>

        <h3>Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px;">Image</th>
              <th style="text-align: left; padding: 8px;">Product</th>
              <th style="text-align: center; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
        .map(
          (item) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px;">
                  <img src="${item.productImages[0]}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                </td>
                <td style="padding: 8px;">${item.name}</td>
                <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right;">$${(item.amount_total / 100).toFixed(2)}</td>
              </tr>`
        )
        .join("")}
          </tbody>
        </table>

        <p style="margin-top: 20px;">
          If you have any questions or need to make changes, feel free to reach out to our support team at 
          <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.
        </p>

        <p style="margin: 0;">Thanks for choosing ${process.env.COMPANY_NAME} – we appreciate your business!</p>

        <br />
        <p style="margin: 0;">Best Regards,</p>
        <p style="margin: 0;"><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
    `,
    attachments,
  };
};

export const orderShipped = ({ userName, email, order }) => {
  return {
    from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Your Order Has Shipped – Order #${order._id}`,
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
        <h1 style="text-align: center;">Hi ${userName},</h1>
        <p>Your order <strong>#${order._id}</strong> has been shipped!</p>

        <h3>Shipping Summary</h3>
        <ul>
          <li><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</li>
          <li><strong>Estimated Delivery Date:</strong> ${order?.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split("T")[0]
        : 'Check tracking link'}</li>
         <li>
         <strong>Total:</strong> $${(order.totalAmount / 100).toFixed(2)}
         </li>
        </ul>

        <h3>Items Shipped:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px;">Image</th>
              <th style="text-align: left; padding: 8px;">Product</th>
              <th style="text-align: center; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
        .map(
          (item) => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px;">
                    <img src="${item.productImages[0]}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                  </td>
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 8px; text-align: right;">$${(item.amount_total / 100).toFixed(2)}</td>
                </tr>`
        )
        .join("")}
          </tbody>
        </table>

        ${order.trackingLink
        ? `<p style="margin-top: 16px;">Track your shipment: 
              <a href="${order.trackingLink}" style="color: blue;">Click here</a>
            </p>`
        : ''
      }

        <p style="margin-top: 20px;">If you have any questions, reach out to us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
        <p>Thanks again for shopping with ${process.env.COMPANY_NAME}!</p>
        <p><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
  `,
  };
};

export const orderDelivered = ({ userName, email, order }) => {
  return {
    from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Your Order Has Been Delivered – Order #${order._id}`,
    html: `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
    <h1 style="text-align: center;">Hi ${userName},</h1>
    <p>Your order <strong>#${order._id}</strong> has been successfully delivered!</p>

    <h3>Delivery Summary</h3>
    <ul>
      <li><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</li>
      <li><strong>Delivered On:</strong> ${order?.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'Recently'}</li>
      <li><strong>Total:</strong> $${(order.totalAmount / 100).toFixed(2)}</li>
    </ul>

    <h3>Items Delivered:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="text-align: left; padding: 8px;">Image</th>
          <th style="text-align: left; padding: 8px;">Product</th>
          <th style="text-align: center; padding: 8px;">Qty</th>
          <th style="text-align: right; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.products
        .map(
          (item) => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px;">
                    <img src="${item.productImages[0]}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                  </td>
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 8px; text-align: right;">$${(item.amount_total / 100).toFixed(2)}</td>
                </tr>`
        )
        .join("")}
      </tbody>
    </table>

    <p style="margin-top: 20px;">We hope you're enjoying your purchase! If you have any issues or feedback, please don't hesitate to reach out.</p>

    <p>Contact us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
    <p>Thanks again for choosing ${process.env.COMPANY_NAME}!</p>
    <p><strong>${process.env.COMPANY_NAME}</strong></p>
  </div>
  `,
  };
};

