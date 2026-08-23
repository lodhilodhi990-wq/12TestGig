# Background Reporting (CSV Exports)

Generating massive CSV files synchronously over an HTTP request is highly susceptible to timeouts and high memory spikes on the Vercel/Next.js edge.

## ReportJob Model
Instead, the platform uses a background processing architecture:
1. Admin selects parameters and clicks "Generate".
2. `queueReportJob()` creates a `report_jobs` document with status `queued`.
3. A background worker (e.g. Firebase Cloud Function or BullMQ) listens to this queue, runs the massive query, streams the data into a CSV format, and uploads it to Cloud Storage.
4. The worker updates the `report_jobs` document status to `completed` and attaches the signed download `fileReference`.
5. The Admin UI updates and displays a "Download CSV" link.

Reports are configured to automatically expire (and be deleted) after 7 days to prevent sensitive data from living indefinitely in temporary storage.
