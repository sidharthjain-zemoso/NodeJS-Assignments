import { z } from "zod";

export const getDataWithSearchAndFilterSchema = z.object({
    pageNo: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
    filter: z.string().optional().refine((val) => {
        try {
            JSON.parse(val!);
            return true;
        } catch (error) {
            return false;
        }
    }, { message: "Filter must be a stringified object" }),
});

export const candidateIdPathParamSchema = z.object({
    candidateId: z.coerce.number().int().positive(),
});

export const preAdverseActionSchema = z.object({
    candidateId: z.string().uuid(),
    action: z.string().optional(),
    reason: z.string().optional(),
});

export const exportCandidatesSchema = z.object({
    search: z.string().optional(),
});

export const addCandidateSchema = z.object({
    name: z.string().min(3).max(45),
    email: z.string().email(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phone: z.string().min(10).max(10),
    location: z.string().min(3).max(45),
    zipcode: z.string().min(5).max(5),
    socialSecurity: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
    driversLicense: z.string().min(10).max(10),
    candidateReport: z.object({
        status: z.string().optional(),
        adjudication: z.string().optional(),
        package: z.string().optional(),
        turnAroundTime: z.number().int().positive().optional(),
    }).optional(),
    courtSearch: z.array(z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    })).optional(),
});

