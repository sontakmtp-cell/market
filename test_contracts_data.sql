-- Test data cho contracts
-- Tạo một số test data để kiểm tra tính năng contract management

-- Trước tiên, kiểm tra xem có users nào không
SELECT id, email FROM auth.users LIMIT 5;

-- Kiểm tra projects
SELECT id, title, client_user_id, freelancer_id, status FROM marketplace_projects LIMIT 5;

-- Kiểm tra proposals 
SELECT id, project_id, freelancer_id, status FROM proposals LIMIT 5;

-- Kiểm tra contracts
SELECT id, project_id, client_id, freelancer_id, status FROM contracts LIMIT 5;

-- Nếu không có data, tạo test data
-- Giả sử có 2 users với id: user1_id và user2_id

-- Insert test project (cần replace với real user IDs)
/*
INSERT INTO marketplace_projects (
    title, 
    shortDescription, 
    client_user_id, 
    status,
    budgetMin,
    budgetMax,
    currency
) VALUES (
    'Test Project for Contract',
    'This is a test project to verify contract functionality',
    'user1_id_here', -- Replace with actual user ID
    'active',
    1000000,
    2000000,
    'VND'
);

-- Insert test proposal (cần replace với real IDs)
INSERT INTO proposals (
    project_id,
    freelancer_id,
    bid_amount,
    timeline,
    cover_letter,
    status
) VALUES (
    1, -- Replace with actual project ID
    'user2_id_here', -- Replace with actual freelancer user ID
    1500000,
    '2 weeks',
    'I can complete this project efficiently',
    'submitted'
);

-- Insert test contract (cần replace với real IDs)
INSERT INTO contracts (
    project_id,
    proposal_id,
    client_id,
    freelancer_id,
    budget_amount,
    currency,
    status,
    contract_terms
) VALUES (
    1, -- Replace with actual project ID
    'proposal_id_here', -- Replace with actual proposal ID
    'user1_id_here', -- Replace with actual client user ID  
    'user2_id_here', -- Replace with actual freelancer user ID
    1500000,
    'VND',
    'active',
    'Test contract for project verification'
);
*/
