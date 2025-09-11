# PowerShell script to run Supabase migration for contracts table
# Run this script to create the contracts table in your Supabase database

Write-Host "Creating contracts table migration..." -ForegroundColor Green

# Check if supabase CLI is available
if (!(Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Apply the migration
Write-Host "Applying migration: create_contracts_table.sql" -ForegroundColor Blue
supabase db push

Write-Host "Migration completed!" -ForegroundColor Green
Write-Host ""
Write-Host "The contracts table has been created with the following features:" -ForegroundColor Cyan
Write-Host "- Stores accepted proposals as active contracts" -ForegroundColor White
Write-Host "- Tracks project progress and milestones" -ForegroundColor White
Write-Host "- Includes payment terms and contract details" -ForegroundColor White
Write-Host "- Row Level Security (RLS) enabled for data protection" -ForegroundColor White
Write-Host ""
Write-Host "You can now use the application to:" -ForegroundColor Cyan
Write-Host "1. Accept proposals in /job-details" -ForegroundColor White
Write-Host "2. View active contracts in /freelancer-dashboard" -ForegroundColor White
