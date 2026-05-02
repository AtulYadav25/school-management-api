import express from 'express'
import validate from '../middleware/validate';
import { addSchoolSchema } from '../validations/schoolValidation';
import db from '../config/db';
import z from 'zod';

const router = express.Router();

router.post('/addSchool', validate(addSchoolSchema), async (req, res) => {
    try {
        const {
            name,
            address,
            latitude,
            longitude
        } = req.body;

        //Add School Data in Database
        const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`
        const result = await db.query(query, [name, address, latitude, longitude]);

        return res.status(201).json({
            success: true,
            message: "School added successfully",
            data: result
        });
    } catch (error) {

    }
})
router.get("/listSchools", async (req, res) => {
    try {

        //Validate the query is number only
        const schema = z.object({
            latitude: z.coerce.number().min(-90).max(90),
            longitude: z.coerce.number().min(-180).max(180)
        })

        const result = schema.parse(req.query);

        const userLatitude = result.latitude;
        const userLongitude = result.longitude;

        // Validate query params
        if (
            isNaN(userLatitude) ||
            isNaN(userLongitude)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid latitude and longitude are required"
            });
        }

        const query = `
      SELECT
        id,
        name,
        address,
        latitude,
        longitude,
        (
          6371 * ACOS(
            COS(RADIANS(?)) *
            COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) *
            SIN(RADIANS(latitude))
          )
        ) AS distance_km

      FROM schools

      ORDER BY distance_km ASC
    `;

        const [schools] = await db.query(query, [
            userLatitude,
            userLongitude,
            userLatitude
        ]);

        return res.status(200).json({
            success: true,
            count: Array.isArray(schools) ? schools.length : 0,
            data: schools
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
});

export default router;