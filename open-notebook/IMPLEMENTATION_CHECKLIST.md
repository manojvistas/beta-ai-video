/**
 * IMPLEMENTATION CHECKLIST: Content Tab v3 Features
 * 
 * Follow this checklist to successfully integrate all new components
 */

// ============================================================================
// PHASE 1: DEPENDENCY INSTALLATION
// ============================================================================

// ✅ Step 1: Install Required Packages
// Command: npm install jspdf html2canvas docx
// Expected output: 3 new packages added to node_modules
// Timeline: ~30-60 seconds
// Verification: Check frontend/package-lock.json shows new entries

// ✅ Step 2: Verify Installation
// Command: npm list jspdf html2canvas docx
// Expected: All three packages show as installed with versions
// If failed: Run npm install again with --save flag

// ============================================================================
// PHASE 2: COMPONENT INTEGRATION
// ============================================================================

// ✅ Step 3: Locate SourceDetailContent Component
// File: frontend/src/app/(dashboard)/sources/components/SourceDetailContent.tsx
// Task: Open file and locate the content rendering section
// Expected: Find existing ReactMarkdown component rendering source.full_text

// ✅ Step 4: Add Component Imports
// Location: Top of SourceDetailContent.tsx file
// Add these import statements:
/*
import { ContentToolbar } from '@/components/source/ContentToolbar'
import { ContentDisplay } from '@/components/source/ContentDisplay'
*/

// ✅ Step 5: Replace Content Rendering
// Location: Content Card in SourceDetailContent.tsx
// Find: Existing markdown rendering with ReactMarkdown
// Replace with:
/*
{source?.full_text ? (
  <>
    <ContentToolbar
      title={source?.title || 'Content'}
      content={source?.full_text || ''}
      htmlContent={source?.full_text || ''}
      sourceUrl={source?.asset?.url}
    />
    <div className="mt-6">
      <ContentDisplay content={source.full_text} />
    </div>
  </>
) : (
  <p className="text-muted-foreground">No content available</p>
)}
*/

// ✅ Step 6: Build and Test
// Command: npm run dev
// Expected: No build errors in terminal
// Expected: Frontend compiles successfully
// Check console: No TypeScript errors

// ============================================================================
// PHASE 3: FEATURE TESTING
// ============================================================================

// ✅ Step 7: Test Export Functionality
// Navigate to: Any source with content
// Task: Click "Export" button
// Expected behaviors:
//   - Dropdown appears with 4 options: PDF, DOCX, Markdown, Text
//   - Hover shows tooltip: "Download content in multiple formats"
//   - Click PDF → File downloads as document-title.pdf
//   - Click DOCX → File downloads as document-title.docx
//   - Click Markdown → File downloads as document-title.md
//   - Click Text → File downloads as document-title.txt
// Validation: Open downloaded file to verify content

// ✅ Step 8: Test Share Functionality
// Navigate to: Any source with content
// Task: Click "Share" button with a sourceUrl set
// Expected behaviors:
//   - Button shows loading state briefly
//   - Toast notification appears: "Link copied to clipboard"
//   - URL is copied to clipboard (can paste in text editor)
// Validation: Paste clipboard content and verify URL format

// ✅ Step 9: Test Text Size Controls
// Navigate to: Any source with content
// Task: Click "A−" button (decrease text size)
// Expected behaviors:
//   - Text size decreases by 10%
//   - Percentage display updates (e.g., "100%" → "90%")
//   - Content immediately reflects new size
//   - Minimum: Cannot go below 75%
// Task: Click "A+" button (increase text size)
// Expected behaviors:
//   - Text size increases by 10%
//   - Percentage display updates
//   - Content immediately reflects new size
//   - Maximum: Cannot go above 200%

// ✅ Step 10: Test Persistence
// Navigate to: Any source with content
// Task: Change text size to 120% and font to "Georgia"
// Expected initial: Changes apply immediately
// Task: Close browser and return to same page
// Expected after reload: Text size 120% and Georgia font still applied
// Validation: Inspect localStorage in DevTools
//   - Open DevTools (F12)
//   - Application tab → Local Storage
//   - Find entry for your domain
//   - Key: contentPreferences should contain: {"textSize": 120, "fontFamily": "georgia"}

// ✅ Step 11: Test Font Selection
// Navigate to: Any source with content
// Task: Click "Font" dropdown
// Expected behaviors:
//   - Dropdown shows 5 font options
//   - Current font is highlighted with checkmark
//   - Font names: Inter, Times New Roman, Arial, Georgia, Roboto
// Task: Select each font one by one
// Expected behaviors:
//   - Content font instantly changes
//   - Dropdown closes after selection
//   - Checkmark moves to selected font

// ✅ Step 12: Test Tooltips and Accessibility
// Navigate to: Any source with content
// Task: Hover over each button
// Expected tooltips:
//   - "A−" → "Decrease text size"
//   - "A+" → "Increase text size"
//   - "100%" → Percentage display (text size value)
//   - Export button → "Download content in multiple formats"
//   - Share button → "Copy shareable link"
//   - Font button → "Select font style"
// Task: Use keyboard navigation
//   - Tab key: Navigate between buttons in order
//   - Arrow keys: Navigate within dropdowns
//   - Enter key: Activate selected option
//   - Esc key: Close open dropdowns

// ✅ Step 13: Test Markdown Rendering
// Navigate to: Source with rich markdown content
// Expected formatting:
//   - Headers (h1, h2, h3) display with correct sizes
//   - Bold text (**text**) displays correctly
//   - Italic text (*text*) displays correctly
//   - Code blocks display with dark background
//   - Links are clickable and blue
//   - Lists (bullets and numbered) format correctly
//   - Tables render with borders
//   - Blockquotes display with left border
//   - Images display (if embedded in markdown)

// ✅ Step 14: Test Error Handling
// Navigate to: Any source with content
// Task: Disable internet connection
// Task: Click Export PDF
// Expected: Toast shows error message: "Failed to export PDF"
// Task: Re-enable internet
// Task: Try exporting again
// Expected: Export succeeds and file downloads

// ============================================================================
// PHASE 4: INTEGRATION VERIFICATION
// ============================================================================

// ✅ Step 15: Check TypeScript Compilation
// Command: npm run build
// Expected: Zero TypeScript errors
// Expected: Build completes successfully
// Check output: No warnings about missing type definitions

// ✅ Step 16: Check Browser Console
// Navigate to: Any source page
// Open: DevTools (F12) → Console tab
// Expected: No error messages
// Expected: No warnings about missing imports
// Expected: No react-markdown or markdown warnings

// ✅ Step 17: Test Multiple Pages
// Navigate to: Different source pages
// Task: Change preferences on page 1
// Task: Navigate to page 2
// Task: Change preferences on page 2 (override page 1 preferences)
// Expected: Each page respects its own preference within session
// Expected: Preferences persist across page navigation

// ✅ Step 18: Test Container Responsiveness
// Navigate to: Any source page with ContentToolbar
// Resize: Shrink browser to mobile width (375px)
// Expected behaviors:
//   - Toolbar buttons stack or wrap appropriately
//   - All buttons remain clickable
//   - No horizontal scrolling required
//   - Content remains readable
// Resize: Regular desktop width (1920px)
// Expected: All buttons display horizontally in one row

// ============================================================================
// PHASE 5: PERFORMANCE VALIDATION
// ============================================================================

// ✅ Step 19: Monitor Performance
// Navigate to: Source with large content (>100KB)
// Task: Open DevTools → Performance tab
// Task: Click Record, change text size 5 times, stop recording
// Expected: No major janks or hangs
// Expected: Preference changes respond within 100ms
// Check timeline: No long tasks (>50ms)

// ✅ Step 20: Check Memory Usage
// Navigate to: Source page
// Task: Open DevTools → Memory tab
// Task: Take heap snapshot
// Task: Change font 10 times
// Expected: Memory usage stays relatively stable
// Expected: No memory leaks detected when navigating away

// ============================================================================
// PHASE 6: EXPORT QUALITY VERIFICATION
// ============================================================================

// ✅ Step 21: Verify PDF Export Quality
// Navigate to: Source with varied formatting
// Task: Export as PDF
// Task: Open PDF file in reader
// Expected:
//   - All text is readable
//   - Images render correctly
//   - Page breaks are logical
//   - Links are preserved
//   - Markdown formatting is present
//   - File size is reasonable (<10MB for typical content)

// ✅ Step 22: Verify DOCX Export Quality
// Navigate to: Source with varied formatting
// Task: Export as DOCX
// Task: Open DOCX file in Word
// Expected:
//   - All text is editable
//   - Formatting is preserved (bold, italic, lists)
//   - Fonts display correctly
//   - Tables are properly formatted
//   - Images are embedded
//   - File opens without errors

// ✅ Step 23: Verify Markdown Export Quality
// Navigate to: Source with code blocks and lists
// Task: Export as Markdown
// Task: Open Markdown file in text editor or markdown viewer
// Expected:
//   - All markdown syntax is correct
//   - Can be re-imported into other markdown tools
//   - Code blocks have language markers (if applicable)
//   - Links are in markdown format: [text](url)

// ✅ Step 24: Verify Text Export Quality
// Navigate to: Source with rich formatting
// Task: Export as Text
// Task: Open text file in text editor
// Expected:
//   - All text content is present
//   - Formatting removed (no bold, italic, or styling)
//   - Readability is good without formatting
//   - File size is minimal

// ============================================================================
// PHASE 7: CLEANUP AND DOCUMENTATION
// ============================================================================

// ✅ Step 25: Remove Old Code (if applicable)
// File: SourceDetailContent.tsx
// Task: Remove old ReactMarkdown component if it was replaced
// Task: Remove unused prose CSS class if it was only for markdown
// Task: Remove any conditional rendering that's no longer needed

// ✅ Step 26: Update Component Comments
// File: SourceDetailContent.tsx
// Task: Add JSDoc comment explaining ContentToolbar and ContentDisplay
// Comment should mention:
//   - What preferences are available
//   - Which localStorage key is used
//   - Links to CONTENT_TAB_INTEGRATION_GUIDE.md

// ✅ Step 27: Git Commit Changes
// Command: git add frontend/src/app/(dashboard)/sources/components/SourceDetailContent.tsx
// Command: git add frontend/package.json
// Command: git add frontend/package-lock.json
// Command: git commit -m "feat: integrate Content Tab v3 export/share/preferences"
// Command: git push origin main

// ✅ Step 28: Create Feature Documentation
// Task: Add entry to CHANGELOG.md:
/*
## [3.0.0] - Content Tab Enhancements
### Added
- Export content as PDF, DOCX, Markdown, or plain text
- Share button with automatic link copying
- Text size adjustment (75%-200% with 10% increments)
- Font selection (5 font options: Inter, Times New Roman, Arial, Georgia, Roboto)
- User preferences persistence via localStorage
- Full keyboard navigation support
- Accessibility enhancements with tooltips and ARIA labels
- Toast notifications for user actions
- Dynamic markdown rendering with custom styling
*/

// ============================================================================
// PHASE 8: POST-DEPLOYMENT VALIDATION
// ============================================================================

// ✅ Step 29: Test in Production Environment
// Task: Deploy changes to staging/production
// Task: Test all export formats on production server
// Task: Verify preferences persist across production domains
// Task: Check storage quota isn't exceeded on shared devices

// ✅ Step 30: Gather User Feedback
// Task: Ask users to test export quality
// Task: Collect feedback on font and text size options
// Task: Record any edge cases or browser compatibility issues
// Task: Note suggestions for future improvements

// ============================================================================
// TROUBLESHOOTING CHECKLIST
// ============================================================================

// If export buttons don't appear:
// ❌ Check 1: ContentToolbar component is imported? → Fix: Add import statement
// ❌ Check 2: Component is rendering without errors? → Fix: Check console for errors
// ❌ Check 3: Required packages are installed? → Fix: npm install jspdf html2canvas docx
// ❌ Check 4: Build completes successfully? → Fix: npm run build and check for TypeScript errors

// If text size changes don't apply:
// ❌ Check 1: ContentDisplay component is imported? → Fix: Add import statement
// ❌ Check 2: ContentDisplay wraps the content? → Fix: Replace old markdown component
// ❌ Check 3: No CSS conflicts with parent? → Fix: Check parent container z-index and overflow
// ❌ Check 4: Browser cache is fresh? → Fix: Hard refresh (Ctrl+Shift+R)

// If preferences don't persist:
// ❌ Check 1: localStorage is enabled? → Fix: Check browser settings
// ❌ Check 2: Run in private mode? → Fix: localStorage doesn't work in private browsing
// ❌ Check 3: Storage quota exceeded? → Fix: Clear localStorage and try again
// ❌ Check 4: Key name matches exactly? → Fix: Check for 'contentPreferences' entry

// If export file is empty or corrupted:
// ❌ Check 1: Content is being passed to ContentToolbar? → Fix: Check prop value
// ❌ Check 2: Browser has enough memory? → Fix: Close other tabs and try again
// ❌ Check 3: Special characters in filename? → Fix: Filename is auto-sanitized, check for errors
// ❌ Check 4: Export function error? → Fix: Check console for specific error message

// ============================================================================
// ESTIMATED TIMELINE
// ============================================================================

/*
Phase 1: Dependencies (2 minutes)
Phase 2: Integration (10 minutes)
Phase 3: Testing (20 minutes)
Phase 4: Verification (5 minutes)
Phase 5: Performance (5 minutes)
Phase 6: Export Quality (10 minutes)
Phase 7: Cleanup (5 minutes)
Phase 8: Deployment (5 minutes)

TOTAL: ~57 minutes for complete implementation and validation

Expedited Timeline (if skipping detailed testing):
- Install dependencies (2 min)
- Integrate components (10 min)
- Quick feature test (5 min)
- Commit and push (2 min)
TOTAL: ~19 minutes
*/

// ============================================================================
// SUCCESS CRITERIA
// ============================================================================

/*
✅ All dependencies installed
✅ Components imported correctly in SourceDetailContent.tsx
✅ No TypeScript errors
✅ Export button creates downloadable files in all 4 formats
✅ Share button copies link to clipboard
✅ Text size +/- buttons work (75%-200% range)
✅ Font selector changes content font
✅ Preferences persist across page reloads
✅ Tooltip appears on hover for all buttons
✅ Keyboard navigation works (Tab between buttons, Enter to activate)
✅ ContentDisplay renders markdown correctly
✅ No console errors
✅ Mobile responsive (buttons don't overflow)
✅ Performance is acceptable (no janky animations)
✅ Exported files have correct formatting
✅ localStorage entry 'contentPreferences' exists and updates
*/

// ============================================================================
