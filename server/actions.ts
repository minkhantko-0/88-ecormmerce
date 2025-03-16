'use server';

import { formatCurrency } from '@/lib/format-currency';
import { utapi } from './uploadthing';

export const deleteImage = async (key: string | string[]) => {
  await utapi.deleteFiles(key);
};

export const sendOrderEmail = async (
  customerName: string,
  customerPhoneNo: string,
  productName: string,
  productPrice: number
) => {
  try {
    await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERSEND_API_TOKEN}`
      },
      body: JSON.stringify({
        from: {
          email: 'onlineshop@88ecormmerce.com',
          name: '88 Ecommerce'
        },
        to: [
          {
            email: process.env.ADMIN_EMAIL || 'minkhant5771@gmail.com',
            name: 'Admin'
          }
        ],
        subject: 'New Order!',
        text:
          'There is a new order from customer ' +
          customerName +
          ' on 88 Ecommerce!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">New Order Notification</h1>
            <p style="font-size: 16px; color: #666;">A new order has been placed on 88 Ecommerce.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 10px;">Customer Details:</h2>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
              <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${customerPhoneNo}</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <h2 style="color: #333; margin-bottom: 10px;">Order Details:</h2>
              <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
              <p style="margin: 5px 0;"><strong>Price:</strong> ${formatCurrency(productPrice)}</p>
            </div>
            <p style="margin-top: 20px; color: #666;">Please process this order as soon as possible.</p>
          </div>
        `
      })
    });
  } catch (e) {
    console.log(e);
  }
};
