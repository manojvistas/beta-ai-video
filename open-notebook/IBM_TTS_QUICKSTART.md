# IBM Watson TTS Integration - Quick Start

**Status**: Ready to use ✅

IBM Watson Text-to-Speech has been integrated into your Open Notebook project. This provides a free alternative to Google Gemini (currently quota-exhausted) and OpenAI.

## Quick Start (5 minutes)

### 1. Get IBM Credentials
- Go to [IBM Cloud](https://cloud.ibm.com/)
- Create account or sign in
- Create a **Text-to-Speech** service (Lite plan = FREE)
- Copy your API Key and Service URL

### 2. Configure .env
Add to your `.env` file:
```bash
IBM_TTS_API_KEY=your_key_from_ibm
IBM_TTS_API_URL=https://api.us-south.text-to-speech.watson.cloud.ibm.com
TTS_BATCH_SIZE=3
```

### 3. Restart Containers
```bash
docker compose down
docker compose up -d
```

### 4. Create Speaker Profiles

**Windows (PowerShell):**
```powershell
.\scripts\setup_ibm_tts.ps1
```

**Linux/macOS:**
```bash
chmod +x scripts/setup_ibm_tts.sh
./scripts/setup_ibm_tts.sh
```

This creates 8 multilingual speaker profiles automatically!

### 5. Generate Podcast
1. Open http://localhost:3000/podcasts
2. Click "Generate Podcast"
3. Select an IBM profile (e.g., `ibm_allison`)
4. Click Generate ✅

---

## Files Added/Modified

### Configuration
- ✅ `.env.example` - Added IBM TTS environment variables
- 📝 `docs/IBM_TTS_SETUP.md` - Comprehensive setup guide

### Scripts
- ✅ `scripts/setup_ibm_tts.ps1` - Windows setup (creates all profiles)
- ✅ `scripts/setup_ibm_tts.sh` - Linux/macOS setup
- ✅ `scripts/test_ibm_tts.py` - Test integration

---

## Available Voices (8 Languages)

| Language | Voice | Gender | Profile Name |
|----------|-------|--------|---|
| 🇺🇸 English (US) | Allison | Female | `ibm_allison` |
| 🇪🇸 Spanish | Enrique | Male | `ibm_enrique` |
| 🇬🇧 English (UK) | Olivia | Female | `ibm_olivia` |
| 🇩🇪 German | Michael | Male | `ibm_michael` |
| 🇫🇷 French | Margot | Female | `ibm_margot` |
| 🇮🇹 Italian | Lucia | Female | `ibm_lucia` |
| 🇯🇵 Japanese | Yuki | Female | `ibm_yuki` |
| 🇨🇳 Mandarin | Li-Wei | Female | `ibm_li_wei` |

---

## Pricing

| Plan | Characters | Cost |
|------|------------|------|
| Lite (Free) | 10,000/month | FREE ✅ |
| Standard | Unlimited | $0.02 per 1,000 chars |

**Example**: A 500-word podcast uses ~3,000 characters = **$0.06** (after free tier)

---

## Troubleshooting

### Test Your Setup
```bash
python scripts/test_ibm_tts.py
```

This checks:
- ✅ Environment variables
- ✅ IBM API connectivity
- ✅ Speaker profiles
- ✅ Available voices

### Common Issues

**Error: "IBM_TTS_API_KEY not found"**
```bash
# Add to .env and restart
IBM_TTS_API_KEY=your_api_key_here
docker compose restart backend
```

**Error: "Authentication failed"**
- Verify API Key (should be ~60 chars)
- Check service region matches URL
- Ensure you created Lite plan (free)

**Error: "Quota exceeded"**
- You've used 10,000 free characters
- Wait until next month OR add payment method to IBM Cloud

### View Logs
```bash
docker compose logs backend | grep -i "ibm\|watson\|tts"
```

---

## Features Included

✅ **8 multilingual voices** - English, Spanish, German, French, Italian, Japanese, Mandarin, and more

✅ **Automatic profile creation** - Setup script creates all profiles at once

✅ **Free tier available** - 10,000 characters/month with no card required

✅ **Multiple regions** - Deploy in your preferred geographic location

✅ **Professional quality** - Neural voices with natural prosody

✅ **Easy switching** - Switch TTS providers anytime (OpenAI, Google, IBM, ElevenLabs)

---

## Next Steps

1. **Follow the Quick Start** above (#1-5)
2. **Read full guide**: `docs/IBM_TTS_SETUP.md`
3. **Test integration**: `python scripts/test_ibm_tts.py`
4. **Create your first podcast** with IBM Watson TTS!

---

## Comparing TTS Providers

| Factor | OpenAI | Google | **IBM** ⭐ | ElevenLabs |
|--------|--------|--------|--------|------------|
| Free Tier | ❌ | Quota limited | ✅ 10k chars | ❌ |
| Setup Ease | Medium | Medium | **Easy** ✅ | Easy |
| Voice Quality | Excellent | Excellent | **Excellent** ✅ | Premium |
| Languages | 5 | 1 | **30+** ✅ | 29 |
| Cost/1000 chars | $0.015 | $0.001 | $0.02 | $0.03 |
| Best For | Fast, simple | Cheap | **Multilingual** ✅ | Premium audio |

**Recommendation**: Use IBM Watson as your primary free TTS provider, switch to OpenAI if you need more volume.

---

## Support & Resources

- **IBM Watson Docs**: https://cloud.ibm.com/docs/text-to-speech
- **Available Voices**: https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices
- **Pricing**: https://www.ibm.com/cloud/text-to-speech/pricing
- **Full Setup Guide**: See `docs/IBM_TTS_SETUP.md`

---

## Questions?

1. Check the logs: `docker compose logs backend`
2. Run the test: `python scripts/test_ibm_tts.py`
3. Read the guide: `docs/IBM_TTS_SETUP.md`
4. Check IBM Console: Verify service is active and API key is correct

Happy podcasting! 🎙️
