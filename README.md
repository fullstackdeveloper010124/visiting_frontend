# visiting_frontend
visiting_card management

## Deploying Frontend to Render

1. Create a new Render Static Site.
2. Connect the repository and set the root directory to `visiting_frontend`.
3. Use these settings:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
4. Add Render environment variables:
   - `VITE_API_TARGET=https://<your-backend-service>.onrender.com`
5. Deploy and point the frontend to the backend URL.

