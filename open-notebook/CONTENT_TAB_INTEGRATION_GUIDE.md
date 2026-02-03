/**
 * INTEGRATION GUIDE: Enhanced Content Tab Features
 * 
 * This guide shows how to integrate all the new content enhancement features
 * into your existing SourceDetailContent component.
 */

// ============================================================================
// 1. INSTALLATION - Dependencies
// ============================================================================

/**
 * Add these dependencies to your package.json:
 * 
 * npm install jspdf html2canvas docx
 * 
 * These are required for export functionality:
 * - jspdf: PDF generation
 * - html2canvas: HTML to image conversion
 * - docx: Word document generation
 */

// ============================================================================
// 2. FILE STRUCTURE
// ============================================================================

/**
 * New files created:
 * 
 * 📁 frontend/src/
 *   ├── 📄 lib/utils/export-utils.ts
 *   │   └── exportContent(), sanitizeFilename(), and format-specific exporters
 *   ├── 📄 lib/hooks/use-content-preferences.ts
 *   │   └── useContentPreferences(), FONT_FAMILIES, FONT_DISPLAY_NAMES
 *   └── 📁 components/source/
 *       ├── 📄 ContentToolbar.tsx
 *       │   └── Complete toolbar with Export, Share, Text Size, Font controls
 *       └── 📄 ContentDisplay.tsx
 *           └── Markdown display with applied preferences
 */

// ============================================================================
// 3. BASIC INTEGRATION
// ============================================================================

/**
 * In your SourceDetailContent.tsx, import the new components:
 */

import { ContentToolbar } from '@/components/source/ContentToolbar'
import { ContentDisplay } from '@/components/source/ContentDisplay'

/**
 * Replace the existing content rendering section with:
 */

export function SourceDetailContent({
  sourceId,
  showChatButton = false,
  onChatClick,
  onClose
}: SourceDetailContentProps) {
  const [source, setSource] = useState<SourceDetailResponse | null>(null)
  // ... other state variables

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Existing sections... */}

        {/* Content Tab with Enhanced Toolbar */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Full extracted content from source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add the ContentToolbar here */}
            <ContentToolbar
              title={source?.title || 'Content'}
              content={source?.full_text || ''}
              htmlContent={source?.full_text || ''}
              sourceUrl={source?.asset?.url}
            />

            {/* Replace old markdown rendering with ContentDisplay */}
            {source?.full_text ? (
              <ContentDisplay content={source.full_text} className="mt-6" />
            ) : (
              <p className="text-muted-foreground">No content available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

// ============================================================================
// 4. USE CASES & EXAMPLES
// ============================================================================

/**
 * USE CASE 1: Export Document
 * 
 * User clicks "Export" → Selects "PDF Document"
 * → PDF is generated with proper formatting → Downloaded as "document-title.pdf"
 * 
 * Supported formats:
 * - PDF: Full page layout with images
 * - DOCX: Word-compatible document with styles
 * - Markdown: Raw markdown for re-editing
 * - TXT: Plain text for minimal file size
 */

/**
 * USE CASE 2: Share Content
 * 
 * User clicks "Share" → Link copied to clipboard
 * → Toast notification confirms copy
 * → User can paste link anywhere to share
 * 
 * Note: For authenticated share links, implement additional API endpoint
 */

/**
 * USE CASE 3: Increase Text Size
 * 
 * User clicks "A+" button → Text size increases by 10%
 * → Preference saved to localStorage
 * → On next visit, user sees same text size
 * → Supports range: 75% to 200%
 */

/**
 * USE CASE 4: Change Font
 * 
 * User clicks "Font" → Selects "Georgia"
 * → Content immediately changes to Georgia font
 * → Preference persisted to localStorage
 * → All future visits use Georgia until changed again
 * 
 * Available fonts:
 * - Inter (Default)
 * - Times New Roman
 * - Arial
 * - Georgia
 * - Roboto
 */

// ============================================================================
// 5. ACCESSIBILITY FEATURES
// ============================================================================

/**
 * Keyboard Navigation:
 * - Tab: Navigate between buttons
 * - Enter/Space: Activate button
 * - Arrow keys: Navigate dropdown menus
 * - Esc: Close dropdowns
 * 
 * Screen Readers:
 * - All buttons have tooltips describing their function
 * - ARIA labels available for export/share actions
 * - Font and text size controls clearly labeled
 */

/**
 * Tooltip Messages:
 * - "Export" → "Download content in multiple formats"
 * - "Share" → "Copy shareable link to clipboard"
 * - "A−" → "Decrease text size"
 * - "A+" → "Increase text size"
 * - "Font" → "Change font style"
 */

// ============================================================================
// 6. CUSTOMIZATION OPTIONS
// ============================================================================

/**
 * A) Modify Font Options (FONT_FAMILIES in use-content-preferences.ts):
 */

// Add new font
const FONT_FAMILIES = {
  // ... existing fonts
  opensans: '"Open Sans", sans-serif',
}

const FONT_DISPLAY_NAMES = {
  // ... existing fonts
  opensans: 'Open Sans',
}

/**
 * B) Adjust Text Size Range (in ContentToolbar.tsx):
 */

// Change increment
const handleIncreaseTextSize = useCallback(() => {
  const newSize = Math.min(250, preferences.textSize + 15) // was 10
  // ...
}, [])

/**
 * C) Customize Export Formats:
 */

// Add CSV export
export async function exportAsCSV(options: ExportOptions): Promise<void> {
  // Implementation
}

/**
 * D) Add Advanced Share Options:
 */

// Generate read-only share link
async function generateShareLink(sourceId: string): Promise<string> {
  const response = await fetch(`/api/sources/${sourceId}/share`, {
    method: 'POST',
  })
  return response.json()
}

// ============================================================================
// 7. PERFORMANCE CONSIDERATIONS
// ============================================================================

/**
 * Memory Management:
 * - ContentDisplay uses React.memo (consider adding if not rendering often)
 * - Export functions are async and clean up DOM elements
 * - localStorage is only read once on mount
 * 
 * Bundle Size:
 * - html2canvas: ~30KB
 * - jsPDF: ~100KB
 * - docx: ~60KB
 * - Consider lazy loading if these are not critical
 * 
 * Optimization:
 * - Use React.lazy() for export components if needed
 * - Cache rendered markdown to avoid re-renders
 * - Debounce text size/font changes if using sliders
 */

// ============================================================================
// 8. ERROR HANDLING
// ============================================================================

/**
 * Export Errors:
 * - Caught and displayed as toast notifications
 * - Users informed of specific format issues
 * - Fallback to text export if PDF fails
 * 
 * Share Errors:
 * - Clipboard API errors handled gracefully
 * - Fallback to manual text selection
 * 
 * Preference Errors:
 * - localStorage failures don't break functionality
 * - Uses in-memory state as fallback
 */

// ============================================================================
// 9. TESTING EXAMPLES
// ============================================================================

/**
 * Unit Tests for export-utils.ts:
 */

/**
 * import { sanitizeFilename } from '@/lib/utils/export-utils'
 * 
 * describe('sanitizeFilename', () => {
 *   it('removes special characters', () => {
 *     expect(sanitizeFilename('File@#$%^&*')).toBe('file')
 *   })
 *   
 *   it('converts spaces to hyphens', () => {
 *     expect(sanitizeFilename('My Document Title')).toBe('my-document-title')
 *   })
 *   
 *   it('limits length to 255 characters', () => {
 *     const long = 'a'.repeat(300)
 *     expect(sanitizeFilename(long).length).toBe(255)
 *   })
 * })
 */

/**
 * Component Tests for ContentToolbar:
 */

/**
 * import { render, screen, fireEvent } from '@testing-library/react'
 * import { ContentToolbar } from '@/components/source/ContentToolbar'
 * 
 * describe('ContentToolbar', () => {
 *   it('renders all buttons', () => {
 *     render(
 *       <ContentToolbar
 *         title="Test"
 *         content="test content"
 *       />
 *     )
 *     expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
 *     expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
 *   })
 *   
 *   it('copies link on share click', async () => {
 *     render(
 *       <ContentToolbar
 *         title="Test"
 *         content="test content"
 *         sourceUrl="http://example.com"
 *       />
 *     )
 *     const shareButton = screen.getByRole('button', { name: /share/i })
 *     fireEvent.click(shareButton)
 *     expect(navigator.clipboard.writeText).toHaveBeenCalled()
 *   })
 * })
 */

// ============================================================================
// 10. FUTURE ENHANCEMENTS
// ============================================================================

/**
 * Potential v4 Features:
 * 
 * 1. Content Annotations
 *    - Highlight key phrases
 *    - Add margin notes
 *    - Export with annotations
 * 
 * 2. Print Optimization
 *    - Print-specific CSS
 *    - Page break handling
 *    - Print preview
 * 
 * 3. Collaborative Features
 *    - Share with team members
 *    - Real-time document updates
 *    - Comments and discussions
 * 
 * 4. Advanced Search
 *    - Full-text search in content
 *    - Regex support
 *    - Search result highlighting
 * 
 * 5. Content Comparison
 *    - Compare multiple sources
 *    - Diff visualization
 *    - Merge capabilities
 * 
 * 6. Reading Guide
 *    - Time to read estimate
 *    - Reading progress bar
 *    - Bookmark support
 * 
 * 7. Accessibility Enhancements
 *    - Text-to-speech
 *    - Dyslexia-friendly font option
 *    - High contrast mode
 * 
 * 8. Dark Mode Toggle
 *    - System preference detection
 *    - Manual override option
 *    - Persistent user preference
 */

// ============================================================================
// 11. MIGRATION FROM EXISTING CODE
// ============================================================================

/**
 * If you're replacing existing markdown rendering:
 * 
 * BEFORE:
 * ---
 * <div className="prose prose-invert">
 *   <ReactMarkdown remarkPlugins={[remarkGfm]}>
 *     {source.full_text}
 *   </ReactMarkdown>
 * </div>
 * 
 * AFTER:
 * ---
 * <ContentDisplay content={source.full_text} />
 * 
 * Benefits:
 * - Automatic text size and font preferences applied
 * - Consistent styling across the app
 * - Better performance with memoization
 * - Easier to maintain and update
 */

// ============================================================================
// 12. TROUBLESHOOTING
// ============================================================================

/**
 * Q: PDF export is not working
 * A: Ensure html2canvas and jsPDF are installed
 *    Check browser console for specific errors
 *    Try exporting as markdown first to isolate the issue
 * 
 * Q: Font changes not persisting
 * A: Check if localStorage is enabled
 *    Clear browser cache and localStorage
 *    Look for localStorage quota errors in console
 * 
 * Q: Text size not applying
 * A: Verify ContentDisplay is being used instead of direct markdown
 *    Check that preferences hook is properly initialized
 *    Look for CSS conflicts with parent containers
 * 
 * Q: Share button not copying
 * A: Clipboard API requires HTTPS (except localhost)
 *    Check browser permissions for clipboard access
 *    Ensure navigator.clipboard is available
 */

// ============================================================================
