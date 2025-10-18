# Task 22: Create Projects and Reports Placeholders (Future Features)

**Phase:** 5 - React UI Components
**Dependencies:** Task 21 (Tasks UI created)

## Description
Create placeholder components for Projects and Reports features that will be implemented in future versions. These serve as navigation targets and structure for later development.

## Implementation Steps

1. **Create Projects placeholder**
   Create `src/features/Projects/ProjectsView.tsx`:
   ```typescript
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
   import { Folder } from '@/components/ui/icons';

   export function ProjectsView() {
     return (
       <div className="flex items-center justify-center h-full">
         <Card className="max-w-md">
           <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
               <Folder className="h-12 w-12 text-muted-foreground" />
             </div>
             <CardTitle>Projects</CardTitle>
             <CardDescription>
               Organize your time entries into projects
             </CardDescription>
           </CardHeader>
           <CardContent className="text-center text-sm text-muted-foreground space-y-2">
             <p>Coming soon:</p>
             <ul className="list-disc list-inside text-left max-w-xs mx-auto space-y-1">
               <li>Create and manage projects</li>
               <li>Assign tasks to projects</li>
               <li>Project-level time tracking</li>
               <li>Client billing integration</li>
               <li>Project budgets and estimates</li>
             </ul>
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

2. **Create Reports placeholder**
   Create `src/features/Reports/ReportsView.tsx`:
   ```typescript
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
   import { BarChart3 } from '@/components/ui/icons';

   export function ReportsView() {
     return (
       <div className="flex items-center justify-center h-full">
         <Card className="max-w-md">
           <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
               <BarChart3 className="h-12 w-12 text-muted-foreground" />
             </div>
             <CardTitle>Reports & Analytics</CardTitle>
             <CardDescription>
               Insights into your time tracking data
             </CardDescription>
           </CardHeader>
           <CardContent className="text-center text-sm text-muted-foreground space-y-2">
             <p>Coming soon:</p>
             <ul className="list-disc list-inside text-left max-w-xs mx-auto space-y-1">
               <li>Daily, weekly, monthly summaries</li>
               <li>Time breakdown by task/project</li>
               <li>Productivity trends</li>
               <li>Export reports (CSV, PDF)</li>
               <li>Custom date range analysis</li>
               <li>Visual charts and graphs</li>
             </ul>
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

3. **Create feature exports**
   Create `src/features/Projects/index.ts`:
   ```typescript
   export { ProjectsView } from './ProjectsView';
   ```

   Create `src/features/Reports/index.ts`:
   ```typescript
   export { ReportsView } from './ReportsView';
   ```

4. **Create README files for future development**
   Create `src/features/Projects/README.md`:
   ```markdown
   # Projects Feature

   ## Purpose
   Allow users to organize time entries into projects for better organization and billing.

   ## Planned Features
   - **Project CRUD:** Create, read, update, delete projects
   - **Project Properties:**
     - Name
     - Client
     - Hourly rate
     - Budget/estimate
     - Status (active/archived)
     - Color coding
   - **Task Assignment:** Assign tasks to projects
   - **Time Aggregation:** Total time per project
   - **Filtering:** View time entries by project

   ## Database Schema (Future)
   ```sql
   CREATE TABLE projects (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     client TEXT,
     hourly_rate REAL,
     budget_hours INTEGER,
     color TEXT,
     status TEXT DEFAULT 'active',
     created_at INTEGER
   );

   -- Add project_id to time_entries and tasks
   ALTER TABLE time_entries ADD COLUMN project_id INTEGER REFERENCES projects(id);
   ALTER TABLE tasks ADD COLUMN project_id INTEGER REFERENCES projects(id);
   ```

   ## UI Components
   - ProjectList
   - ProjectForm (create/edit)
   - ProjectCard (summary view)
   - ProjectDetails (full view with time entries)

   ## Status
   🚧 Not yet implemented - placeholder UI in place
   ```

   Create `src/features/Reports/README.md`:
   ```markdown
   # Reports Feature

   ## Purpose
   Provide insights and analytics on time tracking data.

   ## Planned Features
   - **Time Summaries:**
     - Daily, weekly, monthly totals
     - By task, project, date range
   - **Visualizations:**
     - Bar charts (time per task)
     - Line graphs (time trends)
     - Pie charts (time distribution)
   - **Exports:**
     - CSV export
     - PDF reports
     - Formatted for billing
   - **Analytics:**
     - Most productive times
     - Average session length
     - Task frequency

   ## Report Types
   1. **Daily Summary:** Today's entries with totals
   2. **Weekly Report:** Last 7 days breakdown
   3. **Monthly Report:** Calendar month view
   4. **Custom Range:** User-defined start/end dates
   5. **Task Report:** Time per task with percentages
   6. **Project Report:** Time per project (when projects implemented)

   ## Implementation Ideas
   - Use Chart.js or Recharts for visualizations
   - jsPDF for PDF generation
   - Custom date range picker
   - Print-friendly layouts

   ## Status
   🚧 Not yet implemented - placeholder UI in place
   ```

5. **Document future roadmap**
   Update main `CLAUDE.md`:
   ```markdown
   # Project Overview
   A macOS menu bar timer app built with Electron, React, shadcn/ui, and Tailwind CSS.

   ## Current Status
   ✅ Phase 1-5: Core timer functionality complete
   🚧 Phase 6-7: In progress

   ## Future Features
   - 📁 **Projects:** Organize time entries into billable projects
   - 📊 **Reports:** Analytics and insights on time data
   - 🔄 **Sync:** Cloud sync across devices
   - 🎨 **Themes:** Additional color themes
   - ⚙️ **Settings UI:** In-app settings instead of config.json
   - 📱 **Mobile companion:** View data on phone

   ## Roadmap
   See individual feature README files in `src/features/` for detailed plans.
   ```

## Acceptance Criteria
- [ ] ProjectsView placeholder created
- [ ] ReportsView placeholder created
- [ ] Placeholders show "coming soon" message
- [ ] Feature list documented
- [ ] README files explain future implementation
- [ ] Exports created for both features

## Placeholder Content
- **Visual:** Large icon representing the feature
- **Title:** Feature name
- **Description:** Brief explanation
- **Coming soon list:** Planned features
- **Encouragement:** Let users know it's in development

## Design Consistency
- Match existing app styling
- Use shadcn/ui components
- Center-aligned, friendly tone
- Professional but approachable

## References
- project_init.md lines 33-34, 59 (Projects and reporting view - future extension)
- project_init.md lines 17-44 (Project structure includes Projects/ and Reports/)
