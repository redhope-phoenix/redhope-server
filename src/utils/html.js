const donationRequirementMail = (props) => {
    return (
        `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Urgent Blood Donation Needed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #d32f2f;
            text-align: center;
        }
        p {
            color: #333;
            line-height: 1.6;
        }
        .btn {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #039a30;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>🚨 Urgent Blood Donation Required! 🚨</h2>
        <p>Dear <strong>${props?.userName}</strong>,</p>
        <p>A critical blood donation request has been received for blood group <strong>${props?.bloodGroup}</strong>. Your donation can save a life today!</p>
        <p><strong>Location:</strong> ${props?.address}<br>
           <strong>Contact:</strong> ${props?.phoneNo}</p>
        <p>If you or someone you know can donate, please respond immediately.</p>
        <a href="${props?.navigate}" class="btn">View details</a>
        <p class="footer">Thank you for being a lifesaver! ❤️<br>For more details, visit <a href="https://redhope.vercel.app">Redhope</p>
    </div>

</body>
</html>
`
    )
}

const campaignAwarnessMail = (props) => {
    return (
        `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Join Us for a Health Awareness Campaign!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #00796b;
            text-align: center;
        }
        p {
            color: #333;
            line-height: 1.6;
        }
        .btn {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #00796b;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>🌿 Health Awareness Campaign in your locality! 🌿</h2>
        <p>Dear <strong>${props?.userName}</strong>,</p>
        <p>We are excited to invite you to a <strong>Health & Wellness Campaign</strong> happening near you! Take part in free health checkups, expert consultations, and awareness sessions to promote a healthier lifestyle.</p>
        
        <p><strong>📍 Location:</strong> ${props?.address}<br>
           <strong>📅 Date:</strong> ${props?.date}<br>
           <strong>⏰ Time:</strong> ${props?.time}</p>
        
        <p>Don't miss this opportunity to take a step towards a healthier future!</p>
        <a href="${props?.navigate}" class="btn">View details</a>

        <p class="footer">Stay healthy, stay strong! 💙<br>For more details, visit <a href="https://redhope.vercel.app">Redhope</p>
    </div>

</body>
</html>
`
    )
}

export { donationRequirementMail, campaignAwarnessMail }