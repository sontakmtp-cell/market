-- Create contracts table to store accepted proposals
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL,
    proposal_id UUID NOT NULL,
    client_id UUID NOT NULL,
    freelancer_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline TIMESTAMP WITH TIME ZONE,
    budget_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'VND',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    milestones JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    payment_terms JSONB DEFAULT '{}',
    contract_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_contracts_project 
        FOREIGN KEY (project_id) REFERENCES marketplace_projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_contracts_proposal 
        FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
    CONSTRAINT fk_contracts_client 
        FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_contracts_freelancer 
        FOREIGN KEY (freelancer_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_contracts_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Policy for clients to see their own contracts
CREATE POLICY "Clients can view their own contracts" 
ON contracts FOR SELECT 
USING (client_id = auth.uid());

-- Policy for freelancers to see their own contracts
CREATE POLICY "Freelancers can view their own contracts" 
ON contracts FOR SELECT 
USING (freelancer_id = auth.uid());

-- Policy for clients to insert contracts (when accepting proposals)
CREATE POLICY "Clients can create contracts" 
ON contracts FOR INSERT 
WITH CHECK (client_id = auth.uid());

-- Policy for both parties to update contracts
CREATE POLICY "Contract parties can update contracts" 
ON contracts FOR UPDATE 
USING (client_id = auth.uid() OR freelancer_id = auth.uid());
