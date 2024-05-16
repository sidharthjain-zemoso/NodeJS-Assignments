import { Response } from "express";

export const buildResponse = (res: Response, status: number, message: string, data: any) => {
    return res.status(status).json({ message, response: data });
}

export const buildCsvResponse = (res: Response, status: number, csvString: string) => {
    // This line sets the Content-Type header of the response to indicate that the content being sent is of type CSV (Comma-Separated Values). This header informs the browser or client that the data being sent should be interpreted as CSV format.
    res.setHeader('Content-Type', 'text/csv');
    // This line sets the Content-Disposition header of the response. The attachment disposition type indicates that the content should be treated as a downloadable file rather than displayed directly in the browser. The filename="candidates.csv" parameter suggests the default filename that the browser should use when saving the file. In this case, it suggests "candidates.csv" as the filename.
    res.setHeader('Content-Disposition', 'attachment; filename="candidates.csv"');
    return res.send(csvString);
}