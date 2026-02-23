# IBM Watson Text-to-Speech Integration Guide

This guide explains how to set up IBM Watson Text-to-Speech for podcast generation in Open Notebook.

## Why IBM TTS?

| Feature | OpenAI | Google Gemini | IBM Watson | ElevenLabs |
|---------|--------|---------------|-----------|------------|
| **Free Tier** | Limited | Free (quota exhausted) | 10,000 chars/month ✅ | Limited |
| **Cost** | $0.015/minute | Free then $0.001/req | $0.015/minute | $0.03/1000 chars |
| **Voice Quality** | Excellent | Excellent | Excellent | Premium |
| **Languages** | 5 | 1 | 30+ ✅ | 29 |
| **Reliability** | Stable | Rate limits | Stable ✅ | Stable |
| **Quota Reset** | Monthly | Wait 48h | Monthly | Monthly |

**IBM Watson is ideal if you:**
- Need a free tier with 10,000 characters/month
- Want support for multiple languages
- Have a monthly podcast workflow
- Don't want to wait for Google API quota reset

---

## Step 1: Create IBM Cloud Account

1. Go to [IBM Cloud Console](https://cloud.ibm.com/)
2. Click **Create account** or sign in
3. Verify your email

## Step 2: Create Text-to-Speech Service

1. Click **Create resource** button (top right)
2. Search for **Text to Speech**
3. Click the Watson Text to Speech service
4. Fill in the form:
   - **Service name**: `open-notebook-tts` (or your choice)
   - **Location**: Select your region (e.g., `us-south`, `eu-gb`, `us-east`)
   - **Pricing plan**: **Lite** (free tier) ✅
5. Click **Create**

### Available Regions
- 🇺🇸 `us-south` - Dallas (Recommended)
- 🇪🇺 `eu-gb` - London
- 🇯🇵 `jp-tok` - Tokyo
- 🇦🇺 `au-syd` - Sydney
- 🇨🇦 `ca-tor` - Toronto

## Step 3: Get Your API Credentials

1. After service creation, click **Service credentials** (left menu)
2. Click **New credential** → **Add**
3. You'll see a JSON with:
   ```json
   {
     "apikey": "YOUR_API_KEY_HERE",
     "url": "https://api.us-south.text-to-speech.watson.cloud.ibm.com"
   }
   ```
4. Copy both values

## Step 4: Configure Your .env File

Create or edit `.env` in your Open Notebook root directory:

```bash
# Copy from Step 3
IBM_TTS_API_KEY=YOUR_API_KEY_HERE
IBM_TTS_API_URL=https://api.us-south.text-to-speech.watson.cloud.ibm.com

# Adjust batch size for IBM (fewer concurrent requests)
TTS_BATCH_SIZE=3
```

### Region-Specific URLs
- **us-south** (Dallas): `https://api.us-south.text-to-speech.watson.cloud.ibm.com`
- **us-east** (Washington DC): `https://api.us-east.text-to-speech.watson.cloud.ibm.com`
- **eu-gb** (London): `https://api.eu-gb.text-to-speech.watson.cloud.ibm.com`
- **eu-de** (Frankfurt): `https://api.eu-de.text-to-speech.watson.cloud.ibm.com`
- **au-syd** (Sydney): `https://api.au-syd.text-to-speech.watson.cloud.ibm.com`
- **jp-tok** (Tokyo): `https://api.jp-tok.text-to-speech.watson.cloud.ibm.com`

## Step 5: Restart Docker Containers

```bash
# Stop current containers
docker compose down

# Start with new .env
docker compose up -d
```

Verify it's running:
```bash
# Check logs for IBM TTS initialization
docker compose logs backend | grep -i "ibm\|tts"
```

## Step 6: Set Up Speaker Profiles

### Option A: Automatic Setup (Recommended)

**Windows (PowerShell):**
```powershell
cd scripts
.\setup_ibm_tts.ps1
```

**Linux/macOS (Bash):**
```bash
cd scripts
chmod +x setup_ibm_tts.sh
./setup_ibm_tts.sh
```

This creates profiles for 8 IBM Watson voices:
- ✅ Allison (American English)
- ✅ Enrique (Castilian Spanish)
- ✅ Olivia (British English)
- ✅ Michael (German)
- ✅ Margot (French)
- ✅ Lucia (Italian)
- ✅ Yuki (Japanese)
- ✅ Li-Wei (Mandarin Chinese)

### Option B: Manual Setup

Create a speaker profile via API:

```bash
curl -X POST http://localhost:15055/api/speaker-profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ibm_allison",
    "description": "IBM Watson TTS - Professional American Voice",
    "tts_provider": "ibm",
    "tts_model": "watson-tts",
    "speakers": [
      {
        "name": "Allison",
        "voice_id": "en-US_AllisonV3Voice",
        "backstory": "Professional news anchor with clear enunciation",
        "personality": "professional, authoritative, engaging"
      }
    ]
  }'
```

## Step 7: Generate Your First Podcast

1. Go to http://localhost:3000/podcasts
2. Click **Generate Podcast**
3. Select content source (notes, search results, etc.)
4. Choose episode profile (use default)
5. **Speaker Profile**: Select an IBM profile (e.g., `ibm_allison`)
6. Click **Generate**

### Expected Times
- Small episode (500 words): 30-60 seconds
- Medium episode (1000 words): 1-2 minutes
- Large episode (2000+ words): 3-5 minutes

---

## Available IBM Watson Voices

### English
| Voice | Region | Style |
|-------|--------|-------|
| **Allison V3** | US | Professional, clear |
| **Allison** (older) | US | Standard |
| **Emily** | US | Expressive |
| **Henry** | US | Standard |
| **Kevin** | US | Formal |
| **Michael** | US | Professional |
| **Oliver** | US | Friendly |
| **Olivia** | US | Expressive |

### British English
| Voice | Style |
|-------|-------|
| **Charlotte** | Warm, engaging |
| **George** | Clear, professional |
| **Olivia** | Sophisticated |

### Spanish
| Voice | Region |
|-------|--------|
| **Enrique** | Castilian |
| **Juan** | Castilian |
| **María** | Castilian |

### French
| Voice |
|-------|
| **Margot** |
| **Nicolas** |

### German
| Voice |
|-------|
| **Michael** |
| **Petra** |

### Italian
| Voice |
|-------|
| **Francesca** |
| **Lucia** |

### Portuguese
| Voice | Variant |
|-------|---------|
| **Andreia** | Brazilian |
| **Benilson** | Brazilian |

### Asian Languages
| Language | Voice |
|----------|-------|
| **Japanese** | Emi, Shinji, Yuki |
| **Mandarin** | Li-Wei, Zhen-Jie |
| **Korean** | Hyunjun, Jihun, Seoyeon, Youngmi, Yunah |
| **Arabic** | Laila, Mehdi, Tarik |

---

## Usage Examples

### Create a Multilingual Podcast

```bash
# Create Spanish profile
curl -X POST http://localhost:15055/api/speaker-profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ibm_spanish_podcast",
    "description": "Spanish language podcast",
    "tts_provider": "ibm",
    "tts_model": "watson-tts",
    "speakers": [
      {
        "name": "Enrique",
        "voice_id": "es-ES_EnriqueV3Voice",
        "backstory": "Native Spanish speaker",
        "personality": "friendly, warm, engaging"
      }
    ]
  }'

# Generate podcast in Spanish
# Go to UI and select this profile for Spanish content
```

### Create a Multi-Speaker Podcast

```bash
curl -X POST http://localhost:15055/api/speaker-profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ibm_dialogue_podcast",
    "description": "Two-speaker dialogue podcast",
    "tts_provider": "ibm",
    "tts_model": "watson-tts",
    "speakers": [
      {
        "name": "Host (Allison)",
        "voice_id": "en-US_AllisonV3Voice",
        "backstory": "Main podcast host",
        "personality": "engaging, professional"
      },
      {
        "name": "Guest (Oliver)",
        "voice_id": "en-US_OliverV3Voice",
        "backstory": "Guest speaker",
        "personality": "friendly, knowledgeable"
      }
    ]
  }'
```

---

## Troubleshooting

### 1. "Authentication failed" Error

**Problem**: IBM API credentials not working

**Solution**:
```bash
# Verify API key format
echo $IBM_TTS_API_KEY  # Should be ~60 chars, alphanumeric + underscore

# Test directly with IBM API
curl -X GET https://api.us-south.text-to-speech.watson.cloud.ibm.com/v1/voices \
  -u "apikey:$IBM_TTS_API_KEY" \
  -H "Accept: application/json"
```

### 2. "Service URL not found" Error

**Problem**: Wrong region URL

**Solution**: Check your service region in IBM Cloud Console and update `.env`:
```bash
# Wrong
IBM_TTS_API_URL=https://api.us-south.text-to-speech.watson.cloud.ibm.com  # But service is in eu-gb!

# Right
IBM_TTS_API_URL=https://api.eu-gb.text-to-speech.watson.cloud.ibm.com
```

### 3. "Quota exceeded" Error

**Problem**: Used up free tier (10,000 characters)

**Solution**:
- **Wait**: Quota resets on 1st of next month
- **Upgrade**: Add payment method to IBM Cloud account
- **Switch**: Use Google API once quota resets, or stick with OpenAI

### 4. Podcast Generation Hangs

**Problem**: IBM API is slow or unreliable

**Solution**:
```bash
# Reduce batch size in .env
TTS_BATCH_SIZE=1  # Process one request at a time

# Or increase timeout
API_CLIENT_TIMEOUT=600  # 10 minutes instead of 5
```

### 5. No Audio File Generated

**Problem**: Profile created but no audio files appear

**Solution**:
```bash
# Check Docker logs for errors
docker compose logs backend | tail -50

# Verify profile was created correctly
curl http://localhost:15055/api/speaker-profiles

# Check if podcast-creator library supports IBM
docker compose exec backend python -c "from podcast_creator import configure; print('OK')"
```

---

## Cost Breakdown

### IBM Watson Lite Plan (Free)
- **Free**: 10,000 characters/month
- **After**: $0.02 per 1,000 characters
- **Example**: 500-word podcast = ~3,000 chars = $0.06

### Typical Usage
| Frequency | Podcasts/Month | Characters | Cost |
|-----------|---|---|---|
| Weekly (1/week) | 4 | 12,000 | $0.04 |
| Bi-weekly | 2 | 6,000 | Free |
| Daily | 30 | 90,000 | $1.60 |

---

## Best Practices

1. **Use appropriate voices**
   - Professional content → Allison, Kevin,Michael
   - Casual content → Oliver, Emily
   - Specific language → Use native speaker voices

2. **Monitor quota**
   - Check IBM Cloud Console monthly
   - Plan content in advance
   - Consider caching transcripts

3. **Optimize for TTS**
   - Shorter sentences (< 15 words)
   - Clear paragraph breaks
   - Avoid special characters

4. **Test first**
   - Create test podcast before production
   - Verify audio quality
   - Check timing

---

## Additional Resources

- [IBM Watson TTS Docs](https://cloud.ibm.com/docs/text-to-speech)
- [Available Voices](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices)
- [SSML Support](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-ssml)
- [Pricing](https://www.ibm.com/cloud/text-to-speech/pricing)

---

## Support

If you encounter issues:

1. Check the logs:
   ```bash
   docker compose logs backend | grep -i "ibm\|watson\|error"
   ```

2. Verify credentials:
   ```bash
   docker compose config | grep IBM
   ```

3. Test IBM API directly:
   ```bash
   curl -X GET https://api.us-south.text-to-speech.watson.cloud.ibm.com/v1/voices \
     -u "apikey:YOUR_KEY_HERE"
   ```

4. Check Open Notebook docs: [README.md](../README.md)
