// import express, { json } from 'express';
// import { post } from 'axios';
// import cors from 'cors';
// const app = express();
// const port = 3000;

// const hubspotApiKey = 'YOUR_ACCESS_TOKEN'; 

// app.use(cors({
//     origin: 'http://localhost:5174',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204
// }));

// app.use(json());

// app.get('/qr-scan-handler', async (req, res) => {
//     const customerId = req.query.customer_id;
//     try {
//         await post('https://api.hubapi.com/crm/v3/objects/contacts', {
//             properties: {
//                 email: 'customer@example.com',
//                 firstname: 'Customer',
//                 lastname: 'Example'
//             }
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${hubspotApiKey}`
//             }
//         });
//         res.status(200).send('QR code scanned and data sent to CRM');
//     } catch (error) {
//         res.status(500).send('Error sending data to CRM');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });
