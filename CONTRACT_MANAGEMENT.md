# Tính năng Quản lý Hợp đồng (Contract Management)

## Mô tả
Tính năng này cho phép Client chấp nhận đề xuất từ Freelancer và tự động tạo hợp đồng, sau đó hiển thị trong dashboard của cả hai bên theo đúng vai trò của họ.

## Định nghĩa vai trò

### Người A (Client A)
- Truy cập trang web và chọn tư cách **Client**
- Có thể đăng dự án mới
- Xem và chấp nhận đề xuất từ Freelancer
- Khi truy cập `/freelancer-dashboard` với tư cách **Client**: nhìn thấy dự án trong thẻ "Dự án đang thực hiện"
- Khi truy cập `/freelancer-dashboard` với tư cách **Freelancer**: KHÔNG nhìn thấy dự án trong thẻ "Dự án đang thực hiện"

### Người B (Freelancer B)  
- Truy cập trang web và chọn tư cách **Freelancer**
- Xem chi tiết dự án của Client trong `/job-details`
- Gửi đề xuất cho dự án
- Khi truy cập `/freelancer-dashboard` với tư cách **Freelancer**: nhìn thấy dự án trong thẻ "Dự án đang thực hiện"

## Luồng hoạt động chính xác

### Bước 1: Client A đăng dự án
- **Người A** đăng nhập với tư cách **Client A**
- Nhấp nút "Đăng dự án mới" 
- Tạo dự án mới trong hệ thống

### Bước 2: Freelancer B gửi đề xuất
- **Người B** đăng nhập với tư cách **Freelancer B**
- Truy cập `/job-details/{project_id}` của dự án mà Client A đăng
- Nhấn "Gửi đề xuất" và điền thông tin đề xuất

### Bước 3: Client A chấp nhận đề xuất
- **Người A** (với tư cách Client A) xem các đề xuất trong `/job-details`
- Tìm và chọn đề xuất phù hợp từ Freelancer B
- Nhấn nút "Chấp nhận đề xuất"
- Hệ thống sẽ:
  - Cập nhật trạng thái đề xuất được chọn thành "accepted"
  - Tạo bản ghi hợp đồng mới trong bảng `contracts`
  - Cập nhật `marketplace_projects.freelancer_id` = freelancer được chọn
  - Cập nhật `marketplace_projects.status` thành "in_progress" 
  - Cập nhật các đề xuất khác cho dự án này thành "rejected"

### Bước 4: Hiển thị trong Dashboard theo vai trò
#### Khi Người A truy cập `/freelancer-dashboard`:
- **Với tư cách Client A**: Nhìn thấy dự án trong thẻ "Dự án đang thực hiện" (vì là chủ dự án)
- **Với tư cách Freelancer A**: KHÔNG nhìn thấy dự án này (vì không phải là freelancer được thuê)

#### Khi Người B truy cập `/freelancer-dashboard`:
- **Với tư cách Freelancer B**: Nhìn thấy dự án trong thẻ "Dự án đang thực hiện" (vì được thuê)

## Cấu trúc Database

### Bảng `marketplace_projects` (Dự án freelance)
```sql
- id: bigint (Primary Key, GENERATED ALWAYS AS IDENTITY)
- created_at: timestamp with time zone (DEFAULT now())
- updated_at: timestamp with time zone
- client_user_id: uuid (Foreign Key → auth.users(id))
- title: text NOT NULL
- shortDescription: text
- fullDescription: text
- category: text
- skills: text[] (ARRAY)
- budgetMin: bigint
- budgetMax: bigint
- currency: text (DEFAULT 'VND')
- duration: text
- deadline: timestamp with time zone
- isUrgent: boolean (DEFAULT false)
- location: text
- attachments: text[] (ARRAY)
- objectives: text[] (ARRAY)
- technicalRequirements: text[] (ARRAY)
- deliverables: text[] (ARRAY)
- client: jsonb
- proposalCount: integer (DEFAULT 0)
- status: text (DEFAULT 'active')
- freelancer_id: uuid (Foreign Key → auth.users(id), được set khi có contract)
```

### Bảng `proposals` (Đề xuất của freelancer)
```sql
- id: uuid (Primary Key, DEFAULT gen_random_uuid())
- freelancer_id: uuid (Foreign Key → auth.users(id))
- bid_amount: numeric NOT NULL
- timeline: text
- cover_letter: text
- status: text (DEFAULT 'submitted') - values: submitted, accepted, rejected
- created_at: timestamp with time zone (DEFAULT now())
- project_id: bigint (Foreign Key → marketplace_projects(id))
```

### Bảng `contracts` (Hợp đồng)
```sql
- id: uuid (Primary Key, DEFAULT gen_random_uuid())
- project_id: bigint (Foreign Key → marketplace_projects(id))
- proposal_id: uuid (Foreign Key → proposals(id))
- client_id: uuid (Foreign Key → auth.users(id))
- freelancer_id: uuid (Foreign Key → auth.users(id))
- status: text (DEFAULT 'active') - values: active, completed, cancelled, paused
- start_date: timestamp with time zone (DEFAULT now())
- deadline: timestamp with time zone
- budget_amount: numeric NOT NULL
- currency: text (DEFAULT 'VND')
- progress: integer (DEFAULT 0, range 0-100)
- milestones: jsonb
- deliverables: jsonb
- payment_terms: jsonb
- contract_terms: text
- created_at: timestamp with time zone (DEFAULT now())
- updated_at: timestamp with time zone (DEFAULT now())
```

### Bảng `profiles` (Thông tin người dùng)
```sql
- id: uuid (Primary Key, Foreign Key → auth.users(id))
- updated_at: timestamp with time zone
- username: text UNIQUE
- display_name: text
- avatar_url: text
- cover_image_url: text
- bio: text
- location: text
- languages: text[] (ARRAY)
- phone: text
- social_links: jsonb
- visibility: jsonb
- role_profiles: jsonb (chứa thông tin theo vai trò: client, freelancer)
```

## Cài đặt

### 1. Chạy Migration
```bash
# Sử dụng script bash (Linux/Mac)
./scripts/run-migration.sh

# Hoặc sử dụng PowerShell (Windows)
./scripts/run-migration.ps1

# Hoặc chạy migration thủ công
supabase db push
```

### 2. Cập nhật Types
File `src/types/supabase.ts` đã được cập nhật để bao gồm bảng `contracts`.

## Components mới

### 1. ActiveContracts Component
- **File**: `src/pages/freelancer-dashboard/components/ActiveContracts.jsx`
- **Chức năng**: Hiển thị danh sách hợp đồng/dự án đang thực hiện
- **Props**: 
  - `userRole`: 'freelancer' hoặc 'client'

### 2. Contract Service
- **File**: `src/services/contractService.js`
- **Chức năng**: Xử lý các thao tác CRUD với hợp đồng theo vai trò người dùng
- **Methods**:
  - `getActiveContractsByRole(userId, role)`: Lấy hợp đồng theo vai trò (client hoặc freelancer)
  - `getFreelancerActiveContracts(freelancerId)`: Lấy hợp đồng của freelancer
  - `getClientActiveContracts(clientId)`: Lấy hợp đồng của client  
  - `createContract(projectId, proposalId, clientId, freelancerId, contractData)`: Tạo hợp đồng mới
  - `updateContractProgress(contractId, progress, userId)`: Cập nhật tiến độ
  - `completeContract(contractId, userId)`: Hoàn thành hợp đồng
  - `cancelContract(contractId, userId, reason)`: Hủy hợp đồng
  - `getContractDetails(contractId, userId)`: Lấy chi tiết hợp đồng

### 3. Project Service Updates
- **File**: `src/services/jobService.js` (hoặc tạo `projectService.js`)
- **Chức năng bổ sung**: Xử lý logic chấp nhận đề xuất
- **Methods mới**:
  - `acceptProposal(projectId, proposalId, clientId)`: Chấp nhận đề xuất và tạo contract
  - `rejectOtherProposals(projectId, acceptedProposalId)`: Từ chối các đề xuất khác
  - `updateProjectStatus(projectId, status, freelancerId)`: Cập nhật trạng thái dự án

## Logic hiển thị trong ActiveContracts Component

### Quan trọng: Hiển thị theo vai trò hiện tại
Component `ActiveContracts` phải kiểm tra:
1. **User ID**: ID của người dùng hiện tại
2. **Current Role**: Vai trò hiện tại (Client hoặc Freelancer)
3. **Contract Role**: Vai trò của user trong từng hợp đồng cụ thể

### Quy tắc hiển thị:
- **Khi user với role = "Client"**: Chỉ hiển thị các hợp đồng mà `client_id = user_id`
- **Khi user với role = "Freelancer"**: Chỉ hiển thị các hợp đồng mà `freelancer_id = user_id`

### Ví dụ cụ thể với SQL query:
```javascript
// Trong ActiveContracts.jsx
const getContractsForCurrentRole = async () => {
  const currentUser = getCurrentUser();
  const currentRole = getCurrentRole(); // 'client' hoặc 'freelancer'
  
  if (currentRole === 'client') {
    // Lấy hợp đồng mà user này là client
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        marketplace_projects (
          id, title, shortDescription, status
        ),
        proposals (
          id, bid_amount, timeline
        )
      `)
      .eq('client_id', currentUser.id)
      .eq('status', 'active');
    
    return data;
  } else if (currentRole === 'freelancer') {
    // Lấy hợp đồng mà user này là freelancer
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        marketplace_projects (
          id, title, shortDescription, status
        ),
        proposals (
          id, bid_amount, timeline
        )
      `)
      .eq('freelancer_id', currentUser.id)
      .eq('status', 'active');
    
    return data;
  }
  
  return [];
};
```

## Cập nhật trong ExistingProposals Component

### Chức năng mới trong `handleConfirmAccept`:
```javascript
const handleConfirmAccept = async (proposal) => {
  try {
    // Bước 1: Tạo hợp đồng mới
    const contractData = {
      project_id: projectId,
      proposal_id: proposal.id,
      client_id: currentUser.id,
      freelancer_id: proposal.freelancer_id,
      budget_amount: proposal.bid_amount,
      deadline: project.deadline,
      contract_terms: `Hợp đồng cho dự án: ${project.title}`,
      milestones: project.deliverables?.map(d => ({
        name: d,
        completed: false,
        due_date: null
      })) || [],
      payment_terms: {
        method: 'milestone',
        currency: project.currency || 'VND'
      }
    };

    // Tạo contract
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert([contractData])
      .select()
      .single();

    if (contractError) throw contractError;

    // Bước 2: Cập nhật proposal được chấp nhận
    const { error: proposalError } = await supabase
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposal.id);

    if (proposalError) throw proposalError;

    // Bước 3: Cập nhật project
    const { error: projectError } = await supabase
      .from('marketplace_projects')
      .update({ 
        status: 'in_progress',
        freelancer_id: proposal.freelancer_id
      })
      .eq('id', projectId);

    if (projectError) throw projectError;

    // Bước 4: Từ chối các proposals khác
    const { error: rejectError } = await supabase
      .from('proposals')
      .update({ status: 'rejected' })
      .eq('project_id', projectId)
      .neq('id', proposal.id);

    if (rejectError) throw rejectError;

    // Thông báo thành công
    showNotification('Đã chấp nhận đề xuất và tạo hợp đồng thành công!', 'success');
    
    // Refresh data
    fetchProposals();
    
  } catch (error) {
    console.error('Error accepting proposal:', error);
    showNotification('Có lỗi xảy ra khi chấp nhận đề xuất', 'error');
  }
};
```

### Dữ liệu hợp đồng bao gồm:
- Thông tin dự án và đề xuất từ database
- Điều khoản hợp đồng tự động tạo
- Lịch thanh toán theo milestone
- Milestones dựa trên deliverables của project
- Metadata về currency và payment terms

## Bảo mật (RLS Policies)

### Policies đã được tạo cho bảng `contracts`:
```sql
-- Policy cho Client xem hợp đồng của mình
CREATE POLICY "Clients can view their own contracts" ON public.contracts
FOR SELECT USING (auth.uid() = client_id);

-- Policy cho Freelancer xem hợp đồng của mình  
CREATE POLICY "Freelancers can view their own contracts" ON public.contracts
FOR SELECT USING (auth.uid() = freelancer_id);

-- Policy cho Client tạo hợp đồng
CREATE POLICY "Clients can create contracts" ON public.contracts
FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Policy cho cả hai bên cập nhật hợp đồng
CREATE POLICY "Contract parties can update contracts" ON public.contracts
FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);
```

### Policies cần thiết cho bảng `marketplace_projects`:
```sql
-- Cho phép client cập nhật freelancer_id khi tạo contract
CREATE POLICY "Clients can update their projects freelancer" ON public.marketplace_projects
FOR UPDATE USING (auth.uid() = client_user_id);
```

### Policies cần thiết cho bảng `proposals`:
```sql
-- Cho phép client cập nhật status của proposals
CREATE POLICY "Clients can update proposal status" ON public.proposals
FOR UPDATE USING (
  auth.uid() IN (
    SELECT client_user_id FROM marketplace_projects 
    WHERE id = proposals.project_id
  )
);
```

## Testing

### Kịch bản kiểm tra đầy đủ:

#### Bước 1: Người A tạo dự án với tư cách Client
1. **Người A** đăng nhập và chọn role "Client"
2. Truy cập `/job-post` và tạo dự án mới
3. Kiểm tra dự án đã được tạo thành công

#### Bước 2: Người B gửi đề xuất với tư cách Freelancer  
1. **Người B** đăng nhập và chọn role "Freelancer" 
2. Truy cập `/job-details/{project_id}` của dự án Người A vừa tạo
3. Nhấn "Gửi đề xuất" và điền thông tin
4. Kiểm tra đề xuất đã được gửi thành công

#### Bước 3: Người A chấp nhận đề xuất
1. **Người A** (role Client) truy cập `/job-details/{project_id}`
2. Xem danh sách đề xuất từ Người B
3. Nhấn "Chấp nhận đề xuất" 
4. Kiểm tra hệ thống thực hiện:
   - Tạo hợp đồng thành công trong bảng `contracts`
   - Cập nhật `proposals.status = 'accepted'` cho đề xuất được chọn
   - Cập nhật `marketplace_projects.status = 'in_progress'`
   - Cập nhật `marketplace_projects.freelancer_id = freelancer_id`
   - Cập nhật các proposals khác thành `status = 'rejected'`

#### Bước 4: Kiểm tra Dashboard theo vai trò

##### Test case 4.1: Người A với role Client
- Truy cập `/freelancer-dashboard` với role "Client"
- **Kết quả mong đợi**: Thấy dự án trong "Dự án đang thực hiện"
- **Lý do**: Người A là client_id trong hợp đồng

##### Test case 4.2: Người A với role Freelancer  
- **Người A** đổi role thành "Freelancer"
- Truy cập `/freelancer-dashboard` với role "Freelancer"
- **Kết quả mong đợi**: KHÔNG thấy dự án trong "Dự án đang thực hiện"
- **Lý do**: Người A không phải là freelancer_id trong hợp đồng

##### Test case 4.3: Người B với role Freelancer
- **Người B** truy cập `/freelancer-dashboard` với role "Freelancer"
- **Kết quả mong đợi**: Thấy dự án trong "Dự án đang thực hiện"
- **Lý do**: Người B là freelancer_id trong hợp đồng

### Kết quả mong đợi:
- Đề xuất được chấp nhận thành công với `proposals.status = 'accepted'`
- Hợp đồng mới xuất hiện trong bảng `contracts` 
- Project status chuyển thành `marketplace_projects.status = 'in_progress'`
- Project có `marketplace_projects.freelancer_id` được set
- Các đề xuất khác có `proposals.status = 'rejected'`
- Hợp đồng hiển thị đúng trong dashboard theo vai trò:
  * **Client A**: Thấy dự án khi role = "Client", không thấy khi role = "Freelancer"  
  * **Freelancer B**: Thấy dự án khi role = "Freelancer"

### Database Verification:
```sql
-- Kiểm tra contract được tạo
SELECT c.*, mp.title, p.bid_amount 
FROM contracts c
JOIN marketplace_projects mp ON c.project_id = mp.id
JOIN proposals p ON c.proposal_id = p.id
WHERE c.client_id = 'client_user_id';

-- Kiểm tra project status
SELECT id, title, status, freelancer_id, client_user_id
FROM marketplace_projects 
WHERE id = project_id;

-- Kiểm tra proposals status
SELECT id, freelancer_id, status, bid_amount
FROM proposals 
WHERE project_id = project_id
ORDER BY created_at;
```

## Lưu ý quan trọng về Role-Based Access

### Nguyên tắc cốt lõi:
1. **Một người dùng có thể có nhiều vai trò**: Người A có thể vừa là Client vừa là Freelancer
2. **Dashboard hiển thị theo vai trò hiện tại**: Chỉ hiển thị hợp đồng phù hợp với role đang chọn
3. **Phân biệt rõ ràng**: 
   - `client_id` trong contracts = ID của người là client trong hợp đồng đó
   - `freelancer_id` trong contracts = ID của người là freelancer trong hợp đồng đó
   - Current user role ≠ Contract role (cùng 1 người có thể có roles khác nhau)

### Database Relationships:
```sql
-- Một user có thể là client trong nhiều contracts
contracts.client_id → auth.users.id

-- Một user có thể là freelancer trong nhiều contracts  
contracts.freelancer_id → auth.users.id

-- Một project chỉ có 1 client
marketplace_projects.client_user_id → auth.users.id

-- Một project chỉ có 1 freelancer được chọn (sau khi có contract)
marketplace_projects.freelancer_id → auth.users.id
```

### Cảnh báo Implementation:
- **SAI**: Hiển thị tất cả hợp đồng mà user tham gia (bất kể role)
- **ĐÚNG**: Chỉ hiển thị hợp đồng phù hợp với role hiện tại của user

## Lưu ý

### Điều kiện tiên quyết:
- Cần có Supabase project đã setup
- Các bảng `marketplace_projects`, `proposals`, `profiles`, `contracts` phải tồn tại
- Authentication phải hoạt động đúng
- RLS (Row Level Security) policies đã được thiết lập

### Database Schema Requirements:
- Đảm bảo foreign key constraints đã được tạo đúng
- Indexes cho performance:
  ```sql
  CREATE INDEX idx_contracts_client_id ON contracts(client_id);
  CREATE INDEX idx_contracts_freelancer_id ON contracts(freelancer_id);
  CREATE INDEX idx_contracts_project_id ON contracts(project_id);
  CREATE INDEX idx_proposals_project_id ON proposals(project_id);
  CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
  ```

### Một số hạn chế hiện tại:
- Chưa có tính năng thông báo realtime
- Chưa có workflow approval phức tạp
- Payment integration chưa được implement

## Phát triển tiếp theo

### Tính năng có thể thêm:
1. **Notifications**: Thông báo realtime khi có cập nhật
2. **File Management**: Upload/download files trong dự án
3. **Milestone Tracking**: Quản lý milestone chi tiết hơn
4. **Payment Integration**: Tích hợp thanh toán online
5. **Contract Templates**: Template hợp đồng có sẵn
6. **Dispute Resolution**: Giải quyết tranh chấp
7. **Rating System**: Đánh giá sau khi hoàn thành
