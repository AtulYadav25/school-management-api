import { z } from "zod";

export const addSchoolSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    address: z.string().min(1, "Address is required").max(255),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
});
