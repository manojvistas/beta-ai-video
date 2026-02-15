# Google OAuth Debugging Guide

## Status After Fixes
- ✅ Changed RegisterForm and LoginForm to remove `disabled={!authApiUrl}`
- ✅ Updated OAuth handlers to use relat path `/api/auth/google` when authApiUrl is empty
- ✅ Rebuilt and restarted Docker containers
- ✅ Frontend is running on http://localhost:13000

## Testing Steps

### Step 1: Verify Frontend Button is Enabled
1. Open http://localhost:13000/register in browser
2. Look for "Continue with Google" button
3. **Expected**: Button should be clickable (not grayed out/disabled)
4. **If fails**: Open browser DevTools (F12) → Console → Check for JavaScript errors

### Step 2: Verify Button Click Makes HTTP Request
1. Open http://localhost:13000/register in browser
2. Open DevTools (F12) → Network tab
3. Click "Continue with Google" button
4. **Expected**: Should see a GET request to `/api/auth/google` with status 302 (redirect)
5. **If no request appears**: Check Console for errors, the onClick handler might not be firing
6. **If request exists but fails**: Check the response status code and message

### Step 3: Verify Middleware Proxying
1. Check frontend logs: `docker compose logs frontend | grep "Proxying /api/auth/google"`
2. **Expected**: Should see log: `[Middleware] Proxying /api/auth/google to http://auth-api:4000/api/auth/google`
3. **If not present**: Button click hasn't reached middleware yet

### Step 4: Verify Auth API Receiving Request
1. Check auth-api logs: `docker compose logs auth-api --tail 20`
2. **Expected**: Should see authentication attempt or redirect to Google
3. **If no request**: Middleware didn't route request to auth-api

## Common Issues & Solutions

###Issue 1: Button Still Disabled
**Symptom**: "Continue with Google" button is grayed out
**Causes**:
- Frontend code not updated (old Docker image)
- `authApiUrl` state value is still being checked incorrectly

**Solution**:
```bash
# Rebuild frontend
docker compose down
docker compose up -d --build

# Verify code in running container:
docker compose exec frontend cat /app/.next/standalone/frontend/src/components/auth/RegisterForm.tsx | grep -A 3 "handleGoogleLogin"
```

### Issue 2: Button Click Doesn't Make Request
**Symptom**: Click button, nothing happens, no network request
**Causes**:
- JavaScript error in click handler
- Event handler not attached
- Frontend not rebuilt with changes

**Solution**:
1. Open DevTools Console (F12) and watch for errors
2. Check if `handleGoogleLogin` function exists: 
   ```javascript
   // In browser console:
   console.log(typeof handleGoogleLogin) // should be "function"
   ```

### Issue 3: Request to /api/auth/google Returns Error
**Symptom**: GET /api/auth/google returns 404, 500, or 405
**Causes**:
- Middleware not routing to auth-api
- Auth-api routes not set up correctly
- Method not GET (should be GET)

**Solution**:
1. Check auth-api routes: `docker compose logs auth-api | grep "google"`
2. Verify middleware environment variable:
   ```bash
   docker compose logs frontend | grep "INTERNAL_AUTH_API_URL"
   ```
3. Test direct call to auth-api:
   ```bash
   docker compose exec frontend curl http://auth-api:4000/api/auth/google -v
   ```

### Issue 4: Google Redirect or Credentials Error
**Symptom**: Get redirected to Google, but get error like "invalid_client" or credentials rejected
**Causes**:
- Google  OAuth credentials missing or invalid
- GOOGLE_CALLBACK_URL doesn't match registered URL in Google Cloud Console
- localhost:4000 not reachable by Google servers

**Solution**:
1. Verify credentials are set:
   ```bash
   docker compose exec auth-api printenv | grep GOOGLE
   ```
2. Check if credentials are valid in Google Cloud Console
3. For localhost testing with Docker, you may need:
   - ngrok tunnel to expose localhost:4000 publicly
   - Update GOOGLE_CALLBACK_URL to ngrok URL
   - Register ngrok URL in Google Cloud Console
   - Update docker-compose.yml environment with ngrok URL

### Issue 5: Callback URL Mismatch
**Symptom**: Google error says "The redirect URI in the request, {uri}, does not match the ones authorized for the OAuth client."
**Root Cause**: 
- GOOGLE_CALLBACK_URL in auth-api/.env doesn't match registered URLs in Google Cloud Console
- For Docker on localhost, Google can't reach http://localhost:4000

**Solution**:
```bash
# Option 1: Use ngrok for localhost testing
# Terminal 1:
ngrok http 4000
# Copy the https URL provided

# Terminal 2: Update .env and docker-compose
export NGROK_URL="https://abc123.ngrok.io"
# Edit auth-api/.env:
GOOGLE_CALLBACK_URL=https://abc123.ngrok.io/api/auth/google/callback

# Register this URL in Google Cloud Console Settings
# Then restart:
docker compose down && docker compose up -d

# Option 2: Use production domain instead of localhost
# Update GOOGLE_CALLBACK_URL to your production domain
```

## Verification Commands

```bash
# Check if containers are running
docker compose ps

# Check frontend is serving
curl http://localhost:13000/register

# Check auth-api is running
curl http://localhost:4000/health

# Check middleware routing
docker compose logs frontend | tail -50

# Check auth-api logs
docker compose logs auth-api | tail -50

# Test OAuth endpoint directly
curl -v http://localhost:4000/api/auth/google

# View environment variables in auth-api
docker compose exec auth-api env | sort
```

## Code Changes Made

### RegisterForm.tsx
```javascript
// BEFORE:
const handleGoogleLogin = () => {
    if (authApiUrl) {
        window.location.href = `${authApiUrl}/api/auth/google`
    }
}
// Button was: disabled={!authApiUrl}

// AFTER:
const handleGoogleLogin = () => {
    const oauthUrl = authApiUrl ? `${authApiUrl}/api/auth/google` : '/api/auth/google'
    window.location.href = oauthUrl
}
// Button is now: no disabled attribute
```

### LoginForm.tsx
```javascript
// BEFORE:
onClick={() => {
    if (authApiUrl) {
        window.location.href = `${authApiUrl}/api/auth/google`
    }
}}
// Button was: disabled={!authApiUrl}

// AFTER:
onClick={() => {
    const oauthUrl = authApiUrl ? `${authApiUrl}/api/auth/google` : '/api/auth/google'
    window.location.href = oauthUrl
}}
// Button is now: no disabled attribute
```

## Environment Configuration

### Expected in docker-compose.yml (frontend service)
```yaml
environment:
  - INTERNAL_AUTH_API_URL=http://auth-api:4000
```

### Expected in auth-api/.env
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

## Next Steps

1. **Verify button is clickable**: Check /register page, button should not be grayed out
2. **Check network request**: Use DevTools Network tab to verify request is being made
3. **Check middleware logs**: Confirm `/api/auth/google` is being proxied to auth-api
4. **Check auth-api logs**: Verify Passport.js is being invoked
5. **Verify Google credentials**: Ensure GOOGLE credentials are valid and properly registered
6. **Test with ngrok**: If Google can't reach localhost, use ngrok tunnel for testing

Feel free to share the error messages from DevTools Console or docker logs if you encounter issues!
