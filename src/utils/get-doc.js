export const redhopeFeatues = `

Redhope Feature List

Feature 1: Create Blood Donation Requests
Description: Users can create a blood donation request by providing necessary details such as blood group, reason for donation, required date, contact information, etc.
URL: ${process.env.CORS_ORIGIN}/create-request

Feature 2: Contribute Campaign
Description: Users can share information about any health campaign they know about by filling out a form with details like date, time, venue, and campaign leaflet.
URL: ${process.env.CORS_ORIGIN}/create-campaign

Feature 3: Request History
Description: Users can view their blood donation request history, which lists all previous requests made.
URL: ${process.env.CORS_ORIGIN}/profile/requests

Feature 4: Campaign Contribution History
Description: Users can view the campaigns they have previously contributed to and shared on Redhope.
URL: ${process.env.CORS_ORIGIN}/profile/contributions

Feature 5: Edit Profile
Description: Users can update personal information like name, date of birth, contact details, address, and blood group.
URL: ${process.env.CORS_ORIGIN}/profile-edit

Feature 6: Notifications
Description: Users can view notifications related to blood donation requests, health campaigns, and other relevant updates.
URL: ${process.env.CORS_ORIGIN}/notifications

Feature 7: Privacy Policy
Description: Users can read the privacy policy of Redhope.
URL: ${process.env.CORS_ORIGIN}/privacy

Feature 8: Terms and Conditions
Description: Users can review the terms and conditions of using Redhope.
URL: ${process.env.CORS_ORIGIN}/terms
`

export const redhopeFAQs = `

Redhope FAQ List

1. How to request for blood donation?
On the homepage or under the "My Requests" tab in the profile section, click the "Request for Blood Donation" button. Fill in the form with necessary details such as applicant name, address, contact info, required blood group, reason, and deadline. Submit the form to create the request.

2. How will I know if someone is willing to help?
Once a donor accepts your request, you’ll receive an email from Redhope with the subject “A Donor has accepted your request.” The email will contain a "View Request" button showing the donor’s details.
You can also check the status under "My Requests" in your profile, including how many people received your request and how many responded.

3. How to mark a request fulfilled, share it, or cancel it?
Go to the "My Requests" tab in your profile. Click on a specific request to mark it fulfilled, cancel it, or share it with others. You can also see how many donors accepted the request.

4. How does Redhope work?
When a blood request is made, Redhope checks the location and blood group, then sends emails to users nearby with matching blood groups. When a user agrees to help, the requester receives an email with the donor’s contact information to coordinate directly.

5. How to share campaign information?
Click the "Contribute Campaign" button on the homepage or under "My Contributions" in your profile. Fill in the form with campaign details and upload the leaflet. Submit to share the campaign with all users on Redhope.

6. How to view health campaign information?
Campaigns are listed on the homepage under “Campaigns.” You can filter campaigns by location. Clicking a campaign will show its full details.

7. How to edit personal info or change password?
Click your profile icon and select "Edit Profile." You’ll be able to update personal details and change your password from there.

8. How to log out of Redhope?
Click your profile icon and select "Logout" to securely log out of your Redhope account.

9. How to report a health campaign?
Click on the specific campaign from the homepage campaign list. You’ll find the option to report it on that page.

`