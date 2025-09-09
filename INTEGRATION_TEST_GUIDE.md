# Integration Test Guide

## Prerequisites

1. **Environment Setup**: Ensure you have a `.env.local` file with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Setup**: Ensure you have a `marketplace_projects` table in Supabase with the required schema.

3. **Application Running**: Start the development server:
   ```bash
   npm start
   ```

## Test Scenarios

### Scenario 1: Create a New Project

1. **Navigate to the application**: Open `http://localhost:4028` in your browser
2. **Authenticate**: 
   - Go to `/login` and sign in with a valid account
   - Or create a new account via `/register`
3. **Create Project**:
   - Navigate to `/job-post`
   - Fill out the project form with test data:
     - Title: "Test Project - Thiết kế hệ thống HVAC"
     - Category: "mechanical"
     - Budget: 10,000,000 - 20,000,000 VND
     - Skills: ["AutoCAD", "HVAC", "MEP Design"]
     - Description: Complete project description
   - Submit the form
4. **Verify Creation**:
   - Should redirect to `/job-details/{project-id}`
   - Check Supabase dashboard for the new record
   - Verify all fields are saved correctly

### Scenario 2: View Projects in Marketplace

1. **Navigate to Marketplace**: Go to `/job-marketplace`
2. **Verify Data Display**:
   - Projects should load from Supabase (not mock data)
   - Check that your newly created project appears
   - Verify filtering and search functionality works
3. **Project Navigation**:
   - Click on a project card
   - Should navigate to `/job-details/{project-id}`
   - Project details should load correctly

### Scenario 3: Edit Existing Project

1. **Navigate to Project Details**: Go to a project you own
2. **Verify Edit Button**:
   - If you're the project owner, "Chỉnh sửa dự án" button should be visible
   - If not the owner, button should not appear
3. **Edit Project**:
   - Click the edit button
   - Should navigate to `/job-post/edit/{project-id}`
   - Form should pre-populate with existing data
4. **Update Project**:
   - Modify some fields (e.g., budget, description)
   - Submit the form
   - Should redirect back to project details
   - Verify changes are saved in Supabase

### Scenario 4: Authentication Flow

1. **Unauthenticated Access**:
   - Try to access `/job-post` without being logged in
   - Should redirect to login page
2. **Permission Testing**:
   - Try to edit someone else's project
   - Should show access denied or not show edit button
3. **Login/Logout Flow**:
   - Test the complete authentication cycle
   - Verify user state persists across page refreshes

## Expected Database Records

After testing, you should see records in your `marketplace_projects` table like:

```sql
SELECT 
  id,
  title,
  category,
  budgetMin,
  budgetMax,
  client_user_id,
  created_at,
  updated_at
FROM marketplace_projects
ORDER BY created_at DESC;
```

## Common Issues and Solutions

### 1. Environment Variables Not Loaded
**Problem**: "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
**Solution**: 
- Ensure `.env.local` file exists in project root
- Restart the development server after adding environment variables

### 2. Authentication Errors
**Problem**: User is null or authentication fails
**Solution**: 
- Check Supabase dashboard for user accounts
- Verify authentication flow in browser dev tools
- Ensure RLS policies allow the operations

### 3. Database Schema Issues
**Problem**: INSERT/UPDATE operations fail
**Solution**: 
- Verify table schema matches the expected columns
- Check column types and constraints
- Review RLS policies for INSERT/UPDATE permissions

### 4. Navigation Issues
**Problem**: Routes don't work or show 404
**Solution**: 
- Verify all routes are defined in `src/Routes.jsx`
- Check for typos in route paths
- Ensure components are imported correctly

## Performance Testing

1. **Load Testing**: Create multiple projects and verify marketplace performance
2. **Search Testing**: Test search functionality with various keywords
3. **Filter Testing**: Verify all filter options work correctly
4. **Mobile Testing**: Test responsive behavior on different screen sizes

## Security Testing

1. **Row Level Security**: 
   - Try to edit projects you don't own
   - Verify proper error handling
2. **Input Validation**:
   - Test with invalid data types
   - Test with extremely long inputs
   - Test with special characters
3. **Authentication Bypass**:
   - Try accessing protected routes without authentication
   - Verify proper redirects to login

## Data Verification

After each test, verify in Supabase dashboard:

1. **Data Integrity**: All fields saved correctly
2. **User Association**: `client_user_id` matches current user
3. **Timestamps**: `created_at` and `updated_at` are correct
4. **Data Types**: Arrays, objects, and primitives stored properly

## Cleanup

After testing, you may want to clean up test data:

```sql
-- Remove test projects
DELETE FROM marketplace_projects 
WHERE title LIKE 'Test Project%';

-- Or remove all projects for a specific user
DELETE FROM marketplace_projects 
WHERE client_user_id = 'your-test-user-id';
```

## Success Criteria

The integration is successful if:

✅ **Create**: New projects can be created and saved to Supabase
✅ **Read**: Projects are fetched and displayed from Supabase
✅ **Update**: Existing projects can be edited and updated
✅ **Authentication**: Proper user authentication and authorization
✅ **Navigation**: All routes work correctly
✅ **UI/UX**: Form states reflect create vs edit modes
✅ **Error Handling**: Graceful handling of errors and edge cases
✅ **Security**: Row Level Security properly enforced
