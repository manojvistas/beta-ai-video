# Google OAuth Flow Fix

## Problem
Google OAuth buttons on the register and login pages were disabled because `getAuthApiUrl()` returns an empty string (to use the relative path through middleware). The button's `disabled` attribute was set to `disabled={!authApiUrl}`, which disabled it when the auth URL was empty.

## Root Cause Analysis
The frontend authentication flow has two modes:
1. **Production/Docker**: `NEXT_PUBLIC_AUTH_API_URL` env var set → Use external auth API URL directly
2. **Development & Relative Path**: `NEXT_PUBLIC_AUTH_API_URL` not set → Return empty string and use middleware proxy

The RegisterForm and LoginForm were not handling the second case properly:
- They disabled the Google button when `authApiUrl` was empty
- This prevented any OAuth flow from initiating in the default configuration

## Solution
Modified both `RegisterForm.tsx` and `LoginForm.tsx` to:

### 1. Remove disabled condition
```typescript
// ❌ BEFORE
disabled={!authApiUrl}

// ✅ AFTER
// (removed disabled attribute entirely)
```

### 2. Use flexible URL resolution
```typescript
// ❌ BEFORE
const handleGoogleLogin = () => {
  if (authApiUrl) {
    window.location.href = `${authApiUrl}/api/auth/google`
  }
}

// ✅ AFTER
const handleGoogleLogin = () => {
  // Use authApiUrl if available, otherwise use relative path (proxied through middleware)
  const oauthUrl = authApiUrl ? `${authApiUrl}/api/auth/google` : '/api/auth/google'
  window.location.href = oauthUrl
}
```

## How the Fix Works

### Request Flow
```
User clicks "Continue with Google"
    ↓
Browser calls /api/auth/google (relative path)
    ↓
Next.js middleware (src/middleware.ts) intercepts
    ↓
Middleware checks INTERNAL_AUTH_API_URL env var = http://auth-api:4000
    ↓
Middleware rewrites request to http://auth-api:4000/api/auth/google
    ↓
Auth API receives request on port 4000
    ↓
Passport.js initiates Google OAuth flow
    ↓
User is redirected to Google consent screen
    ↓
Google redirects back to /api/auth/google/callback
    ↓
Auth API creates JWT tokens, sets cookies
    ↓
Auth API redirects to /notebooks
```

### Environment Configuration
The docker-compose.yml already has the correct configuration:
```yaml
frontend:
  environment:
    - INTERNAL_AUTH_API_URL=http://auth-api:4000
```

This allows the Next.js middleware to proxy `/api/auth/*` requests to the auth API container.

## Files Modified
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/components/auth/LoginForm.tsx`

## Testing
1. Start the containers: `docker compose up -d`
2. Navigate to http://localhost:13000/register
3. Click "Continue with Google" button
4. Should be redirected to Google consent screen
5. After authorization, should create account and redirect to notebooks

## Commit
```
Commit: 81d1caa
Message: Fix Google OAuth flow on register and login pages
```

## Related Files
- `auth-api/.env` - Contains Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)
- `frontend/src/middleware.ts` - Routes /api/auth/* to auth-api container
- `auth-api/src/controllers/OAuthController.js` - Handles OAuth routes
- `auth-api/src/config/passport.js` - Passport.js Google strategy configuration
