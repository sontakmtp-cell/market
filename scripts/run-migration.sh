#!/bin/bash

# Script to run Supabase migration for contracts table
# Run this script to create the contracts table in your Supabase database

echo "Creating contracts table migration..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Apply the migration
echo "Applying migration: create_contracts_table.sql"
supabase db push

echo "Migration completed!"
echo ""
echo "The contracts table has been created with the following features:"
echo "- Stores accepted proposals as active contracts"
echo "- Tracks project progress and milestones"
echo "- Includes payment terms and contract details"
echo "- Row Level Security (RLS) enabled for data protection"
echo ""
echo "You can now use the application to:"
echo "1. Accept proposals in /job-details"
echo "2. View active contracts in /freelancer-dashboard"
