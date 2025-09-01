# Email Setup Instructions for Car Service Website

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. Go to Email Services in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" 
4. Connect your Gmail account (hussainwasim827@gmail.com)
5. Note down the SERVICE ID (e.g., service_abc123)

## Step 3: Create Email Template
1. Go to Email Templates in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:** New Car Service Booking - {{customer_name}}

**Body:**
```
🚗 NEW CAR SERVICE BOOKING

Customer Details:
👤 Name: {{customer_name}}
📞 Phone: {{customer_phone}}
✉️ Email: {{customer_email}}

Service Details:
🔧 Service Type: {{service_type}}
🚙 Car Model: {{car_model}}
📍 Address: {{address}}
⏰ Preferred Time: {{preferred_time}}

Additional Notes:
{{additional_notes}}

Booking Date: {{booking_date}}

Please contact the customer to confirm the appointment.
```

4. Save the template and note the TEMPLATE ID (e.g., template_xyz789)

## Step 4: Get Public Key
1. Go to Account > General
2. Copy your Public Key (e.g., user_abcdef123456)

## Step 5: Update Website Code
Replace these values in script.js:

```javascript
// Line 8: Replace YOUR_PUBLIC_KEY
emailjs.init('user_abcdef123456'); // Your actual public key

// Line 65: Replace YOUR_SERVICE_ID  
'service_abc123',    // Your actual service ID

// Line 66: Replace YOUR_TEMPLATE_ID
'template_xyz789',   // Your actual template ID
```

## Step 6: Test the Setup
1. Open your website
2. Fill out the enquiry form
3. Submit the form
4. Check your Gmail for the booking notification

## Troubleshooting
- Make sure Gmail service is properly connected
- Check that all IDs are correctly copied
- Verify your Gmail account can receive emails
- Check browser console for any error messages

## Free Plan Limits
- 200 emails per month
- EmailJS branding in emails
- Upgrade to paid plan for more emails and remove branding

Your customers' enquiry details will now be automatically sent to hussainwasim827@gmail.com whenever someone submits the booking form!